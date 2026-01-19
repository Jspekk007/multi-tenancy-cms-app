import { customLogger } from '@backend/lib/logger';
import { prismaClient } from '@backend/lib/prisma';
import { ErrorFactory } from '@backend/modules/error/ErrorFactory';
import { addMailToQueue } from '@backend/queues/emailQueue';
import { Prisma, PrismaClient } from '@prisma/client';
import crypto from 'crypto';

import { AuthResponse, AuthUser, LoginInput, RegisterInput } from './auth.types';
import { generateToken, hashPassword, verifyPassword } from './auth.utils';
import { SessionService } from './session/session.service';
import { RefreshTokenResponse } from './session/session.types';

export class AuthService {
  private prisma: PrismaClient;
  private sessionService: SessionService;

  constructor() {
    this.prisma = prismaClient;
    this.sessionService = new SessionService(this.prisma);
  }

  SALT_ROUNDS = Number(process.env?.BCRYPT_SALT_ROUNDS) || 10;
  JWT_SECRET = process.env?.JWT_SECRET;

  async register(input: RegisterInput): Promise<AuthResponse> {
    const hashedPassword = await hashPassword(input.password);

    customLogger.info('Register process started');

    customLogger.info(
      `Attempting to sign up user with email: ${input.email} and domain: ${input.domain}`,
    );

    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    const existingDomain = await this.prisma.tenant.findUnique({
      where: { domain: input.domain },
    });

    if (existingUser || existingDomain) {
      throw ErrorFactory.conflict('User or Domain already exists.');
    }

    const { tenant, user, tenantUser } = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const createdTenant = await tx.tenant.create({
          data: {
            name: input.name,
            domain: input.domain,
          },
        });

        const adminRole = await tx.role.create({
          data: {
            name: 'ADMIN',
            tenantId: createdTenant.id,
          },
        });

        const createdUser = await tx.user.create({
          data: {
            email: input.email,
            passwordHash: hashedPassword,
          },
        });

        const createdTenantUser = await tx.tenantUser.create({
          data: {
            tenantId: createdTenant.id,
            userId: createdUser.id,
            roleId: adminRole.id,
          },
          include: {
            tenant: true,
          },
        });

        customLogger.info(
          `User ${createdUser.email} signed up for tenant ${createdTenant.name} (${createdTenant.domain})`,
        );

        await addMailToQueue({
          to: createdUser.email,
          subject: 'Welcome to Atlas CMS',
          template: 'welcome',
          context: {
            name: createdUser.email || 'User',
            domain: createdTenant.domain,
          },
        });

        return {
          tenant: createdTenant,
          user: createdUser,
          tenantUser: createdTenantUser,
        };
      },
    );

    const refreshToken = await this.sessionService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const createdSession = await this.sessionService.createSession({
      userId: user.id,
      tenantId: tenant.id,
      refreshToken,
      expiresAt,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenant.id,
      role: tenantUser.roleId,
      sessionId: createdSession.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        tenantId: tenant.id,
        domain: tenant.domain,
        role: tenantUser.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    customLogger.info(`Login attempt for email: ${input.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw ErrorFactory.unauthorized('Invalid email or password');
    }

    if (!(await verifyPassword(input.password, user.passwordHash))) {
      throw ErrorFactory.unauthorized('Invalid email or password');
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });
    if (!tenantUser) {
      throw ErrorFactory.badRequest('User is not associated with any tenant');
    }

    customLogger.info(`User ${user.email} logged in successfully`);

    const refreshToken = await this.sessionService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const createdSession = await this.sessionService.createSession({
      userId: user.id,
      tenantId: tenantUser.tenantId,
      refreshToken,
      expiresAt,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenantUser.tenantId,
      role: tenantUser.roleId,
      sessionId: createdSession.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        tenantId: tenantUser.tenantId,
        domain: tenantUser.tenant.domain,
        role: tenantUser.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    customLogger.info('Refresh token attempt');

    const session = await this.sessionService.findSessionByToken(refreshToken);
    if (!session) {
      throw ErrorFactory.unauthorized('Invalid refresh token.');
    }

    // Update last used timestamp
    await this.sessionService.updateSessionLastUsed(session.id);

    // Get user and tenant information
    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw ErrorFactory.notFound('User not found.');
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: {
        userId: user.id,
        tenantId: session.tenantId || undefined,
      },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw ErrorFactory.badRequest('User is not associated with any tenant');
    }

    // Generate new tokens
    const newRefreshToken = this.sessionService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    // Revoke old session and create new one
    await this.sessionService.revokeSession(session.id);
    const newSession = await this.sessionService.createSession({
      userId: user.id,
      tenantId: tenantUser.tenantId,
      refreshToken: newRefreshToken,
      expiresAt,
    });

    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenantUser.tenantId,
      role: tenantUser.roleId,
      sessionId: newSession.id,
    });

    customLogger.info(`Token refreshed for user ${user.email}`);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        tenantId: tenantUser.tenantId,
        domain: tenantUser.tenant.domain,
        role: tenantUser.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async requestPasswordResetLink(email: string): Promise<void> {
    customLogger.debug(`Password reset requested for email: ${email}`);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    customLogger.debug(`Found user for password reset: ${user ? 'yes' : 'no'}`);

    if (!user) {
      customLogger.warn(`Password reset requested for non-existing email: ${email}`);
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 360000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt: expires,
        userId: user.id,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/forgot-password?token=${token}`;

    await addMailToQueue({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        name: user.email || 'User',
        resetLink,
      },
    });
  }

  async logout(refreshToken: string): Promise<void> {
    customLogger.info('Logout attempt');

    const session = await this.sessionService.revokeSessionByToken(refreshToken);
    if (!session) {
      throw ErrorFactory.unauthorized('Invalid refresh token.');
    }

    customLogger.info(`User logged out, session ${session.id} revoked`);
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ErrorFactory.notFound('User not found.');
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw ErrorFactory.badRequest('User is not associated with any tenant');
    }

    return {
      id: user.id,
      email: user.email,
      tenantId: tenantUser.tenantId,
      domain: tenantUser.tenant.domain,
      role: tenantUser.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
