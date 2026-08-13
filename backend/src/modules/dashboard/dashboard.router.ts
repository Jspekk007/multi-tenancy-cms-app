import { createRouter } from '@backend/trpc';

import { dashboardSummaryProcedure } from './_procedures/summary.procedure';

export const dashboardRouter = createRouter({
  summary: dashboardSummaryProcedure,
});
