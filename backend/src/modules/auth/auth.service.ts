import { Prisma, PrismaClient } from '@prisma/client';

import { ApiError } from '../../lib/errors';
import { customLogger } from '../../lib/logger';
import { prismaClient } from '../../lib/prisma';
import { AuthResponse, AuthUser, LoginInput, SignupInput } from './auth.types';
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

  async signup(input: SignupInput): Promise<object> {
    const hashedPassword = await hashPassword(input.password);

    customLogger.info('Signup process started');

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
      throw new ApiError('User or domain already exists', 409);
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.name,
          domain: input.domain,
        },
      });

      const adminRole = await tx.role.create({
        data: {
          name: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash: hashedPassword,
        },
      });

      await tx.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          roleId: adminRole.id,
        },
      });

      customLogger.info(
        `User ${user.email} signed up for tenant ${tenant.name} (${tenant.domain})`,
      );

      return tenant;
    });
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    customLogger.info(`Login attempt for email: ${input.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    if (!(await verifyPassword(input.password, user.passwordHash))) {
      throw new ApiError('Invalid email or password', 401);
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });
    if (!tenantUser) {
      throw new ApiError('User is not associated with any tenant', 400);
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
      throw new ApiError('Invalid refresh token', 401);
    }

    // Update last used timestamp
    await this.sessionService.updateSessionLastUsed(session.id);

    // Get user and tenant information
    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: {
        userId: user.id,
        tenantId: session.tenantId || undefined,
      },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw new ApiError('User is not associated with any tenant', 400);
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
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    customLogger.info('Logout attempt');

    const session = await this.sessionService.revokeSessionByToken(refreshToken);
    if (!session) {
      throw new ApiError('Invalid refresh token', 401);
    }

    customLogger.info(`User logged out, session ${session.id} revoked`);
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const tenantUser = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (!tenantUser) {
      throw new ApiError('User is not associated with any tenant', 400);
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
