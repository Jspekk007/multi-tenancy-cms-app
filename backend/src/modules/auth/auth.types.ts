import { z } from 'zod';

export const signupInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  domain: z.string().min(3, 'Domain must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export interface AuthUser {
  id: string;
  email: string;
  domain: string;
  tenantId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTTokenPayload {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export type SignupInput = z.infer<typeof signupInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
