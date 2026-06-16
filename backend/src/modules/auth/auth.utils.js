import { config } from '@backend/lib/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const hashPassword = async (password) => await bcrypt.hash(password, config.saltRounds);
export const verifyPassword = async (password, hash) => await bcrypt.compare(password, hash);
export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
};
export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);
//# sourceMappingURL=auth.utils.js.map