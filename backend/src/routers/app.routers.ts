import { createRouter } from 'trpc';

import { authRouter } from '../modules/auth/auth.router';

export const appRouter = createRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
