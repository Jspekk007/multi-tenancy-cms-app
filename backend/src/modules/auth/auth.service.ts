import { customLogger } from '@backend/lib/logger';
import { prismaClient } from '@backend/lib/prisma';
import { ErrorFactory } from '@backend/modules/error/ErrorFactory';
import { addMailToQueue } from '@backend/queues/emailQueue';
import { Prisma, PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';

import {
  AuthResponse,
  AuthTenantOption,
  AuthUser,
  LoginInput,
  LoginResponse,
  RegisterInput,
} from './auth.types';
import { generateToken, hashPassword, verifyPassword } from './auth.utils';
import { SessionService } from './session/session.service';
import { RefreshTokenResponse } from './session/session.types';

type TenantMembership = Prisma.TenantUserGetPayload<{ include: { tenant: true } }>;

export class AuthService {
  private prisma: PrismaClient;
  private sessionService: SessionService;

  constructor() {
    this.prisma = prismaClient;
    this.sessionService = new SessionService(this.prisma);
  }

  SALT_ROUNDS = Number(process.env?.BCRYPT_SALT_ROUNDS) || 10;
  JWT_SECRET = process.env?.JWT_SECRET;

  private mapAuthUser(user: User, tenantUser: TenantMembership): AuthUser {
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

  private mapTenantOption(tenantUser: TenantMembership): AuthTenantOption {
    return {
      id: tenantUser.tenantId,
      name: tenantUser.tenant.name,
      domain: tenantUser.tenant.domain,
      role: tenantUser.roleId,
    };
  }

  private async createAuthResponse(
    user: User,
    tenantUser: TenantMembership,
    sessionIdToRevoke?: string,
  ): Promise<AuthResponse> {
    const refreshToken = await this.sessionService.generateRefreshToken();
    const refreshTokenHash = await this.sessionService.hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const createdSession = await this.prisma.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          userId: user.id,
          tenantId: tenantUser.tenantId,
          refreshTokenHash,
          expiresAt,
        },
      });

      if (sessionIdToRevoke) {
        await tx.session.update({
          where: { id: sessionIdToRevoke },
          data: { isRevoked: true },
        });
      }

      return session;
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenantUser.tenantId,
      role: tenantUser.roleId,
      sessionId: createdSession.id,
    });

    return {
      user: this.mapAuthUser(user, tenantUser),
      token,
      refreshToken,
    };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const normalizedEmail = input.email.toLowerCase();
    const hashedPassword = await hashPassword(input.password);

    customLogger.info('Register process started');

    customLogger.info(
      `Attempting to sign up user with email: ${normalizedEmail} and domain: ${input.domain}`,
    );

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const existingDomain = await this.prisma.tenant.findUnique({
      where: { domain: input.domain },
    });

    if (existingUser || existingDomain) {
      throw ErrorFactory.conflict('User or Domain already exists.');
    }

    const { user, tenantUser } = await this.prisma.$transaction(
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
            email: normalizedEmail,
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
          user: createdUser,
          tenantUser: createdTenantUser,
        };
      },
    );

    return await this.createAuthResponse(user, tenantUser);
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const normalizedEmail = input.email.toLowerCase();
    customLogger.info(`Login attempt for email: ${normalizedEmail}`);

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw ErrorFactory.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ErrorFactory.unauthorized('User account is inactive');
    }

    if (!(await verifyPassword(input.password, user.passwordHash))) {
      throw ErrorFactory.unauthorized('Invalid email or password');
    }

    const tenantUsers = await this.prisma.tenantUser.findMany({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (!tenantUsers.length) {
      throw ErrorFactory.badRequest('User is not associated with any tenant');
    }

    const sortedTenantUsers = tenantUsers.sort((a, b) =>
      a.tenant.name.localeCompare(b.tenant.name),
    );

    if (input.tenantId) {
      const selectedTenantUser = sortedTenantUsers.find(
        (tenantUser) => tenantUser.tenantId === input.tenantId,
      );

      if (!selectedTenantUser) {
        throw ErrorFactory.forbidden('User is not associated with the selected tenant');
      }

      customLogger.info(
        `User ${user.email} logged in successfully for tenant ${selectedTenantUser.tenant.domain}`,
      );

      return await this.createAuthResponse(user, selectedTenantUser);
    }

    if (sortedTenantUsers.length > 1) {
      return {
        requiresTenantSelection: true,
        tenants: sortedTenantUsers.map((tenantUser) => this.mapTenantOption(tenantUser)),
      };
    }

    customLogger.info(
      `User ${user.email} logged in successfully for tenant ${sortedTenantUsers[0].tenant.domain}`,
    );

    return await this.createAuthResponse(user, sortedTenantUsers[0]);
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

    if (!user.isActive) {
      await this.sessionService.revokeSession(session.id);
      throw ErrorFactory.unauthorized('User account is inactive');
    }

    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId: session.tenantId,
          userId: user.id,
        },
      },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw ErrorFactory.badRequest('User is not associated with any tenant');
    }

    const authResponse = await this.createAuthResponse(user, tenantUser, session.id);

    customLogger.info(`Token refreshed for user ${user.email}`);

    return authResponse;
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

  async getUserTenants(userId: string): Promise<AuthTenantOption[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ErrorFactory.notFound('User not found.');
    }

    if (!user.isActive) {
      throw ErrorFactory.unauthorized('User account is inactive');
    }

    const tenantUsers = await this.prisma.tenantUser.findMany({
      where: { userId },
      include: { tenant: true },
    });

    return tenantUsers
      .sort((a, b) => a.tenant.name.localeCompare(b.tenant.name))
      .map((tenantUser) => this.mapTenantOption(tenantUser));
  }

  async switchTenant(userId: string, tenantId: string, currentSessionId: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ErrorFactory.notFound('User not found.');
    }

    if (!user.isActive) {
      throw ErrorFactory.unauthorized('User account is inactive');
    }

    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw ErrorFactory.forbidden('User is not associated with the selected tenant');
    }

    customLogger.info(`User ${user.email} switched to tenant ${tenantUser.tenant.domain}`);

    return await this.createAuthResponse(user, tenantUser, currentSessionId);
  }

  async getCurrentUser(userId: string, tenantId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ErrorFactory.notFound('User not found.');
    }

    if (!user.isActive) {
      throw ErrorFactory.unauthorized('User account is inactive');
    }

    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId,
        },
      },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw ErrorFactory.badRequest('User is not associated with the specified tenant');
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
