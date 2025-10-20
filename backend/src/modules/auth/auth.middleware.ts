import { NextFunction, Request, Response } from 'express';

import { prismaClient } from '../../lib/prisma';
import { JWTTokenPayload } from './auth.types';
import { verifyToken } from './auth.utils';
import { SessionService } from './session/session.service';

const sessionService = new SessionService(prismaClient);

export const authMiddleware = async (
  req: Request & { user?: JWTTokenPayload } & { headers: { authorization?: string } },
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token) as JWTTokenPayload;
    if (!payload || !payload.sessionId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = payload;

    const session = await prismaClient.session.findUnique({ where: { id: payload.sessionId } });
    if (!session || session.isRevoked || session.expiresAt <= new Date()) {
      return res.status(401).json({ message: 'Session is not active' });
    }

    await sessionService.updateSessionLastUsed(session.id);
    next();
    return;
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
