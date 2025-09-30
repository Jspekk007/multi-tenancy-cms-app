import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { Request, Response } from 'express';
import pinoHttp from 'pino-http';

import { ApiError } from './lib/errors';
import { customLogger } from './lib/logger';
import { authRouter } from './modules/auth/auth.router';
import { createContext } from './trpc';

const PORT = process.env.PORT || 4000;
const app = express();
const httpLogger = pinoHttp({ logger: customLogger });
app.use(express.json());
app.use(httpLogger);

function errorMiddleware(error: Error, req: Request, res: Response): Response {
  if (error instanceof ApiError) {
    customLogger.warn({ err: error }, 'API error occurred');
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  customLogger.error({ err: error }, 'Unexpected error occurred');
  return res.status(500).json({
    message: 'Internal Server Error',
  });
}

app.use(
  '/api/v1/auth',
  trpcExpress.createExpressMiddleware({
    router: authRouter,
    createContext,
    onError: ({ error, path, input }) => {
      customLogger.error(
        {
          code: error.code,
          path,
          input,
          message: error.message,
          stack: error.stack,
        },
        'tRPC error',
      );
    },
  }),
);

app.use(errorMiddleware);

app.listen(PORT, () => {
  customLogger.info(`Backend-Express server is running on http://localhost:${PORT}`);
});
