import { config } from '@backend/lib/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, config.saltRounds);

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
  await bcrypt.compare(password, hash);

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): string | object => jwt.verify(token, config.jwtSecret!);
