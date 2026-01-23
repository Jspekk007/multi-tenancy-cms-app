import { authRouter } from '@backend/modules/auth/auth.router';
import { createRouter } from '@backend/trpc';

export const appRouter = createRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
