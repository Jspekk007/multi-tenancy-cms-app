import { authRouter } from '../modules/auth/auth.router';
import { createRouter } from '../trpc';

export const appRouter = createRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
