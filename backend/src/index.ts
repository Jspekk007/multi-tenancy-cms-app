import { customLogger } from '@backend/lib/logger';
import { prismaClient } from '@backend/lib/prisma';
import { authMiddleware } from '@backend/modules/auth/auth.middleware';
import { SessionService } from '@backend/modules/auth/session/session.service';
import { ApiError } from '@backend/modules/error/ApiError';
import * as trpcExpress from '@trpc/server/adapters/express';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import pinoHttp from 'pino-http';
import { appRouter } from 'routers/app.routers';
import { createContext } from 'trpc';

const PORT = process.env.PORT || 4000;
const app = express();
const httpLogger = pinoHttp({ logger: customLogger });

/* ---------------------------------------------
   CORS
--------------------------------------------- */
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

/* ---------------------------------------------
   Core Middleware
--------------------------------------------- */
app.use(express.json());
app.use(httpLogger);

/* ---------------------------------------------
   Authentication Middleware
--------------------------------------------- */
app.use(authMiddleware as unknown as RequestHandler);

/* ---------------------------------------------
   tRPC API Mount
--------------------------------------------- */
app.use(
  '/api/v1',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

/* ---------------------------------------------
   Recurring Session Cleanup (Daily)
--------------------------------------------- */
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

/* ---------------------------------------------
   Global Error Handler  <-- IMPORTANT!
--------------------------------------------- */
app.use((err: unknown, req: Request, res: Response, _next: NextFunction): void | Response => {
  if (err instanceof ApiError) {
    const payload = err.toResponse();
    return res.status(err.httpStatus).json(payload);
  }

  customLogger.error({ err }, 'Unhandled error');

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
    status: 500,
    correlationId: 'untracked',
  });
});

/* ---------------------------------------------
   Server Startup
--------------------------------------------- */
async function startServer(): Promise<void> {
  try {
    customLogger.info('Email Transporter Ready (Ethereal)');
  } catch (error) {
    customLogger.error({ err: error }, 'Failed to initialize Email Transporter!');
  }

  app.listen(PORT, () => {
    customLogger.info(`Backend-Express server is running on http://localhost:${PORT}`);
    customLogger.info(`tRPC API is available at http://localhost:${PORT}/api/v1`);
  });
}

startServer();
