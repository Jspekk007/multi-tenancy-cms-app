import { z } from 'zod';

export const registerInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
  tenantId: z.string().min(1, 'Organization is required').optional(),
});

export const switchTenantInputSchema = z.object({
  tenantId: z.string().min(1, 'Organization is required'),
});

export const resetPasswordLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTTokenPayload {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  sites: AuthSiteOption[];
}

export interface SwitchTenantResponse {
  user: AuthUser;
  token: string;
  sites: AuthSiteOption[];
}

export interface AuthTenantOption {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export interface AuthSiteOption {
  id: string;
  name: string;
  slug: string;
}

export interface TenantSelectionRequiredResponse {
  requiresTenantSelection: true;
  tenants: AuthTenantOption[];
}

export interface AuthContextResponse {
  user: AuthUser;
  tenants: AuthTenantOption[];
  sites: AuthSiteOption[];
}

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type SwitchTenantInput = z.infer<typeof switchTenantInputSchema>;
export type LoginResponse = AuthResponse | TenantSelectionRequiredResponse;
