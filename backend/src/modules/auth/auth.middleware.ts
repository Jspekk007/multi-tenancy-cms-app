import { NextFunction, Request, Response } from 'express';

import { customLogger } from '../../lib/logger';
import { prismaClient } from '../../lib/prisma';
import { JWTTokenPayload } from './auth.types';
import { verifyToken } from './auth.utils';
import { SessionService } from './session/session.service';

const sessionService = new SessionService(prismaClient);

const PUBLIC_PATHS = [
  '/api/v1/auth.login',
  '/api/v1/auth.register',
  '/api/v1/auth.refresh',
  '/api/v1/auth.logout',
  '/api/v1/auth.passwordReset',
];

export const authMiddleware = async (
  req: Request & { user?: JWTTokenPayload } & { headers: { authorization?: string } },
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const pathWithoutQuery = req.originalUrl.split('?')[0];

  customLogger.debug({ path: pathWithoutQuery }, 'Auth middleware invoked');

  if (PUBLIC_PATHS.some((path) => pathWithoutQuery.startsWith(path))) {
    return next();
  }

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
    req.tenantId = payload.tenantId;

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
