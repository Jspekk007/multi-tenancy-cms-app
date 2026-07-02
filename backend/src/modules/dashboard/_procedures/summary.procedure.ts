import { emailQueue } from '@backend/queues/emailQueue';

import { DashboardService } from '../dashboard.service';
import type { DashboardSummaryService } from './summary.procedure.factory';
import { createDashboardSummaryProcedure } from './summary.procedure.factory';

const dashboardService: DashboardSummaryService = new DashboardService(undefined, emailQueue);

export const dashboardSummaryProcedure = createDashboardSummaryProcedure(dashboardService);
