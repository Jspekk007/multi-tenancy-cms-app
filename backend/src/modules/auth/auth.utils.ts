import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = async (password: string, hash: string): Promise<boolean> =>
  await bcrypt.compare(password, hash);

export const generateToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET!, { expiresIn: '1h' });

export const verifyToken = (token: string): string | object => jwt.verify(token, JWT_SECRET!);
