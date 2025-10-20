import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { config } from '../../../lib/config';
import { CreateSessionParams, SessionData } from './session.types';

export class SessionService {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  generateRefreshToken(): string {
    return crypto.randomBytes(config.refreshTokenBytes).toString('hex');
  }

  async hashRefreshToken(token: string): Promise<string> {
    return await bcrypt.hash(token, config.saltRounds);
  }

  async verifyRefreshTokenHash(token: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(token, hash);
  }

  async createSession(params: CreateSessionParams): Promise<SessionData> {
    const refreshTokenHash = await this.hashRefreshToken(params.refreshToken);

    return this.prisma.session.create({
      data: {
        userId: params.userId,
        tenantId: params.tenantId || null,
        refreshTokenHash,
        expiresAt: params.expiresAt,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        deviceName: params.deviceName || null,
      },
    });
  }

  async revokeSession(sessionId: string): Promise<SessionData> {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  async revokeSessionByToken(refreshToken: string): Promise<SessionData | null> {
    const session = await this.findSessionByToken(refreshToken);
    if (!session) {
      return null;
    }
    return this.revokeSession(session.id);
  }

  async findSessionByToken(token: string): Promise<SessionData | null> {
    const sessions = await this.prisma.session.findMany({
      where: { isRevoked: false, expiresAt: { gt: new Date() } },
    });

    for (const session of sessions) {
      const isMatch = await this.verifyRefreshTokenHash(token, session.refreshTokenHash);
      if (isMatch) {
        return session;
      }
    }
    return null;
  }

  async updateSessionLastUsed(sessionId: string): Promise<SessionData> {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    });
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true, lastUsedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // 7 days ago
        ],
      },
    });
    return result.count;
  }

  async getUserSessions(userId: string): Promise<SessionData[]> {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<number> {
    const result = await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    return result.count;
  }
}
