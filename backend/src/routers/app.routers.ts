import { authRouter } from '@backend/modules/auth/auth.router';
import { dashboardRouter } from '@backend/modules/dashboard/dashboard.router';
import { createRouter } from '@backend/trpc';

export const appRouter = createRouter({
  auth: authRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
