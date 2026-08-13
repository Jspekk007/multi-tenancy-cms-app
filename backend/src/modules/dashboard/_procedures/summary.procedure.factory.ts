import { protectedProcedure } from '@backend/trpc';
import { z } from 'zod';

import type { DashboardSummary } from '../dashboard.types';

interface DashboardSummaryScope {
  tenantId: string;
  siteId: string;
}

export interface DashboardSummaryService {
  getSummary(scope: DashboardSummaryScope): Promise<DashboardSummary>;
}

const dashboardSummaryInputSchema = z.object({
  siteId: z.string().min(1, 'Site is required').max(128, 'Site is invalid'),
});

export const createDashboardSummaryProcedure = (dashboardService: DashboardSummaryService) =>
  protectedProcedure.input(dashboardSummaryInputSchema).query(async ({ ctx, input }) => {
    return await dashboardService.getSummary({
      tenantId: ctx.tenantId,
      siteId: input.siteId,
    });
  });
