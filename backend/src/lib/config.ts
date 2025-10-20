import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '../.env' });

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  SALT_ROUNDS: z
    .string()
    .default('10')
    .transform((val) => parseInt(val, 10)),
  REFRESH_TOKEN_BYTES: z
    .string()
    .default('32')
    .transform((val) => parseInt(val, 10)),
  PORT: z
    .string()
    .default('4000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

export const config = {
  jwtSecret: env.JWT_SECRET,
  refreshTokenBytes: env.REFRESH_TOKEN_BYTES,
  saltRounds: env.SALT_ROUNDS,
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
};
