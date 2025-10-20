import { z } from 'zod';

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutInputSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export interface SessionData {
  id: string;
  userId: string;
  tenantId: string | null;
  refreshTokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  deviceName: string | null;
  lastUsedAt: Date | null;
}

export interface CreateSessionParams {
  userId: string;
  tenantId?: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    tenantId: string;
    domain: string;
    role: string;
  };
}

export type RefreshTokenInput = z.infer<typeof refreshTokenInputSchema>;
export type LogoutInput = z.infer<typeof logoutInputSchema>;
