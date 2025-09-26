import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/dist/adapters/express.cjs';

export const t = initTRPC.create();

export const publicProcedure = t.procedure;

export const router = t.router;

export const createContext = (opts: CreateExpressContextOptions): { req: typeof opts.req; res: typeof opts.res } => {
    const { req, res } = opts;

    return { req, res };

};
export type Context = ReturnType<typeof createContext>;