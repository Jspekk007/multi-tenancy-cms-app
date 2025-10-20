import express from 'express';
import { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';

import { ApiError } from './lib/errors';
import { customLogger } from './lib/logger';
import { prismaClient } from './lib/prisma';
import { authMiddleware } from './modules/auth/auth.middleware';
import { AuthService } from './modules/auth/auth.service';
import { SessionService } from './modules/auth/session/session.service';

const PORT = process.env.PORT || 4000;
const app = express();
const httpLogger = pinoHttp({ logger: customLogger });

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(httpLogger);

function errorMiddleware(error: Error, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ApiError) {
    customLogger.warn({ err: error }, 'API error occurred');
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  customLogger.error({ err: error }, 'Unexpected error occurred');
  res.status(500).json({
    message: 'Internal Server Error',
  });
}

// Auth routes
const authService = new AuthService();

app.post('/auth/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.signup(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/auth/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/auth/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

app.get(
  '/auth/me',
  authMiddleware,
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const result = await authService.getCurrentUser(req.user.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

app.use(errorMiddleware);

// Simple daily cleanup job for sessions
const sessionService = new SessionService(prismaClient);
setInterval(
  async () => {
    try {
      const count = await sessionService.cleanupExpiredSessions();
      if (count > 0) {
        customLogger.info({ count }, 'Cleaned up expired/revoked sessions');
      }
    } catch (err) {
      customLogger.error({ err }, 'Failed cleaning up sessions');
    }
  },
  24 * 60 * 60 * 1000,
);

app.listen(PORT, () => {
  customLogger.info(`Backend-Express server is running on http://localhost:${PORT}`);
});
