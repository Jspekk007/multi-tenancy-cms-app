import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

export const publicProcedure = t.procedure;

export const router = t.router;

export const createContext = ({ req, res }: any) => ({ });
export type Context = ReturnType<typeof createContext>;