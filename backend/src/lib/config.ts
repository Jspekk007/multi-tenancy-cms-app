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
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z
    .string()
    .default('6379')
    .transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().default('devpassword'),
  MAIL_HOST: z.string().default('smtp.ethereal.email'),
  MAIL_PORT: z
    .string()
    .default('587')
    .transform((val) => parseInt(val, 10)),
  MAIL_USER: z.string().min(1, 'MAIL_USER is required'),
  MAIL_PASS: z.string().min(1, 'MAIL_PASS is required'),
  MAIL_FROM: z.string().default('"Your App" <no-reply@example.com>'),
});

const env = envSchema.parse(process.env);

export const config = {
  jwtSecret: env.JWT_SECRET,
  refreshTokenBytes: env.REFRESH_TOKEN_BYTES,
  saltRounds: env.SALT_ROUNDS,
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },
  mail: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
    from: env.MAIL_FROM,
  },
};
