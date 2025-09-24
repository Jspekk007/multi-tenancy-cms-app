import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from './auth.types';
import { verifyToken } from './auth.utils';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        if (typeof payload === 'object' && payload !== null && 'id' in payload) {
            req.user = payload as { id: string; email?: string };
        } else {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        next();
        return;
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}