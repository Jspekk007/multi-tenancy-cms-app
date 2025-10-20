import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/dist/adapters/express.cjs';

export const t = initTRPC.create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  const req = (ctx as any).req;
  if (!req.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: req.user,
    },
  });
});

export const router = t.router;

export const createContext = (
  opts: CreateExpressContextOptions,
): { req: typeof opts.req; res: typeof opts.res } => {
  const { req, res } = opts;

  return { req, res };
};
export type Context = ReturnType<typeof createContext>;
