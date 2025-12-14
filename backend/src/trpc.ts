import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/dist/adapters/express.cjs';
import { Request } from 'express';

import { ApiError } from '@/core/errors';

import type { JWTTokenPayload } from './modules/auth/auth.types';

type AuthenticatedUser = JWTTokenPayload;

export interface Context {
  req: Request;
  res: CreateExpressContextOptions['res'];
  user?: AuthenticatedUser;
  tenantId?: string;
}

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ApiError) {
      const apiError = error.cause as ApiError;

      let trpcCode: TRPCError['code'];
      switch (apiError.httpStatus) {
        case 400:
        case 422:
          trpcCode = 'BAD_REQUEST';
          break;
        case 401:
          trpcCode = 'UNAUTHORIZED';
          break;
        case 403:
          trpcCode = 'FORBIDDEN';
          break;
        case 404:
          trpcCode = 'NOT_FOUND';
          break;
        case 409:
          trpcCode = 'CONFLICT';
          break;
        default:
          trpcCode = 'INTERNAL_SERVER_ERROR';
          break;
      }

      return {
        ...shape,
        message: apiError.message,
        code: trpcCode,
        data: {
          ...shape.data,
          code: apiError.code,
          httpStatus: apiError.httpStatus,
          details: apiError.details,
        },
      };
    }
    return shape;
  },
});

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.req.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  const authenticatedUser = ctx.req.user as AuthenticatedUser;

  if (!ctx.req.tenantId) {
    // This check is optional, depending on whether tenantId is required globally
  }

  return next({
    ctx: {
      ...ctx,
      user: authenticatedUser,
      tenantId: ctx.req.tenantId,
    },
  });
});

export const createRouter = t.router;

export const createContext = (opts: CreateExpressContextOptions): Context => {
  const { req, res } = opts;

  return {
    req,
    res,
  };
};
