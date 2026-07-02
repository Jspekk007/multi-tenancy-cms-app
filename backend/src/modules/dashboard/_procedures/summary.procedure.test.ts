import assert from 'node:assert/strict';
import test from 'node:test';

import { type Context, createRouter } from '@backend/trpc';

import type { DashboardSummary } from '../dashboard.types';
import {
  createDashboardSummaryProcedure,
  type DashboardSummaryService,
} from './summary.procedure.factory';

const createAuthenticatedContext = (tenantId: string): Context => ({
  req: {} as Context['req'],
  res: {} as Context['res'],
  tenantId,
  user: {
    userId: 'user_1',
    email: 'user@example.com',
    tenantId,
    role: 'MEMBER',
    sessionId: 'session_1',
    iat: 0,
    exp: 4_102_444_800,
  },
});

const createDashboardSummary = (
  scope: Parameters<DashboardSummaryService['getSummary']>[0],
): DashboardSummary => {
  const checkedAt = new Date('2026-07-01T12:00:00.000Z');

  return {
    site: {
      id: scope.siteId,
      name: 'Site A',
      slug: 'site-a',
    },
    contentVelocity: {
      windowDays: 30,
      startDate: checkedAt,
      endDate: checkedAt,
      created: 0,
      updated: 0,
      published: 0,
      total: 0,
      daily: [],
    },
    activeUsers: {
      windowDays: 7,
      startDate: checkedAt,
      endDate: checkedAt,
      count: 0,
    },
    storageUsed: {
      totalBytes: '0',
      assetCount: 0,
    },
    recentActivity: [],
    infraHealth: {
      app: { status: 'operational', checkedAt },
      database: { status: 'operational', checkedAt },
      storage: { status: 'unknown', checkedAt },
      queue: { status: 'unknown', checkedAt },
    },
    recentCollaborators: [],
  };
};

test('dashboard summary procedure derives tenant scope from authenticated context', async (context) => {
  const getSummaryMock = context.mock.fn(
    async (scope: Parameters<DashboardSummaryService['getSummary']>[0]) =>
      createDashboardSummary(scope),
  );
  const dashboardRouter = createRouter({
    summary: createDashboardSummaryProcedure({
      getSummary: getSummaryMock,
    }),
  });
  const caller = dashboardRouter.createCaller(createAuthenticatedContext('tenant_a'));

  await caller.summary({ siteId: 'site_a', tenantId: 'tenant_b' } as {
    siteId: string;
    tenantId: string;
  });

  assert.equal(getSummaryMock.mock.callCount(), 1);
  assert.deepEqual(getSummaryMock.mock.calls[0].arguments[0], {
    tenantId: 'tenant_a',
    siteId: 'site_a',
  });
});
