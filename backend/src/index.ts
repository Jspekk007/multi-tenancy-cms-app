import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { Request, Response } from "express";
import pinoHttp from 'pino-http';

import { ApiError } from './lib/errors';
import { logger } from './lib/logger';
import { authRouter } from './modules/auth/auth.router';
import { createContext } from "./trpc"

const PORT = process.env.PORT || 4000;
const app = express();
const httpLogger = pinoHttp({ logger });

function errorMiddleware(error: Error, req: Request, res: Response): Response {
    if (error instanceof ApiError) {
        logger.warn({ err: error}, 'API error occurred');
        return res.status(error.statusCode).json({
            message: error.message
        })
    }

    logger.error({ err: error }, 'Unexpected error occurred');
    return res.status(500).json({
        message: 'Internal Server Error'
    });
}
app.use(httpLogger);

app.use(
    "/api/v1/auth",
    trpcExpress.createExpressMiddleware({
        router: authRouter,
        createContext,
        onError: ({ error, path, input}) => {
            logger.error(
                {
                    code: error.code,
                    path,
                    input,
                    message: error.message,
                    stack: error.stack,
                },
                'tRPC error',
            )
        }
    }),
);

app.use(errorMiddleware)

app.listen(PORT, () => {
    logger.info(`Backend-Express server is running on http://localhost:${PORT}`);
});

