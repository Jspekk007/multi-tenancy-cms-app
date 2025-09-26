import { z } from 'zod';

export const signupInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  domain: z.string().min(3, "Domain must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export interface LoginInput {
    email: string;
    password: string;
}

export type SignupInput = z.infer<typeof signupInputSchema>;