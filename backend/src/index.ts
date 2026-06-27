import { customLogger } from '@backend/lib/logger';
import { prismaClient } from '@backend/lib/prisma';
import { authMiddleware } from '@backend/modules/auth/auth.middleware';
import { SessionService } from '@backend/modules/auth/session/session.service';
import { ApiError } from '@backend/modules/error/ApiError';
import { tenantHostMiddleware } from '@backend/modules/tenants/tenant-host.middleware';
import * as trpcExpress from '@trpc/server/adapters/express';
import express, {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express';
import pinoHttp from 'pino-http';

import { rateLimiter } from './middleware/rateLimiter';

import { appRouter } from './routers/app.routers';
import { createContext } from './trpc';

const PORT = process.env.PORT || 4000;
const app = express();
const httpLogger = pinoHttp({ logger: customLogger });

const normalizeOrigin = (origin: string): string | null => {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
};

const allowedFrontendOrigins = new Set(
  [process.env.FRONTEND_URL, ...(process.env.FRONTEND_URLS?.split(',') ?? [])]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin))
    .map(normalizeOrigin)
    .filter((origin): origin is string => Boolean(origin)),
);

const isAllowedOrigin = (origin: string): boolean => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return false;
  }

  if (allowedFrontendOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (process.env.NODE_ENV !== 'production') {
    return /^http:\/\/[a-z0-9-]+\.lvh\.me:3000$/.test(normalizedOrigin);
  }

  return false;
};

/* ---------------------------------------------
   CORS
--------------------------------------------- */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Tenant-Slug',
  );

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
app.use(tenantHostMiddleware);
app.use(rateLimiter());
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
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): undefined | Response => {
  if (err instanceof ApiError) {
    const payload = err.toResponse();
    return res.status(err.httpStatus).json(payload);
  }

  customLogger.error({ err }, 'Unhandled error');

  return res.status(500).json({
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
