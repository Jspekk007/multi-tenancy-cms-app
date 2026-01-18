import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Request } from 'express';
import superjson from 'superjson';

import { ApiError } from '@/core/errors';

import type { JWTTokenPayload } from './modules/auth/auth.types';

type AuthenticatedUser = JWTTokenPayload;

export interface Context {
  req: Request;
  res: CreateExpressContextOptions['res'];
  user?: AuthenticatedUser;
  tenantId?: string;
}

export interface AuthenticatedContext extends Context {
  user: AuthenticatedUser;
  tenantId: string;
}

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
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
          correlationId: apiError.correlationId,
        },
      };
    }
    return shape;
  },
});

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  if (!ctx.tenantId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Tenant ID is required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      tenantId: ctx.tenantId,
    } as AuthenticatedContext,
  });
});

export const createRouter = t.router;

export const createContext = (opts: CreateExpressContextOptions): Context => {
  const { req, res } = opts;

  return {
    req,
    res,
    user: req.user as AuthenticatedUser | undefined,
    tenantId: req.tenantId as string | undefined,
  };
};
