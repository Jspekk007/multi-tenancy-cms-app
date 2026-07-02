import assert from 'node:assert/strict';
import test from 'node:test';

import { DashboardService } from './dashboard.service';

type DashboardPrisma = NonNullable<ConstructorParameters<typeof DashboardService>[0]>;

interface FakePrismaOptions {
  site?: { id: string; name: string; slug: string } | null;
  contentActivityEvents?: Array<{ type: string; createdAt: Date }>;
  recentActivityEvents?: Array<{
    id: string;
    type: string;
    description: string;
    entityType: string | null;
    entityId: string | null;
    createdAt: Date;
    actorTenantUser: { user: { id: string; email: string } } | null;
  }>;
  activeMemberIds?: Array<string | null>;
  storageBytes?: bigint;
  assetCount?: number;
  collaboratorActivity?: Array<{
    actorTenantUserId: string | null;
    _max: { createdAt: Date | null };
  }>;
  collaborators?: Array<{
    id: string;
    userId: string;
    roleId: string;
    user: { email: string };
  }>;
}

const createFakePrisma = (options: FakePrismaOptions = {}) => {
  const calls: Record<string, unknown[]> = {
    siteFindFirst: [],
    activityEventFindMany: [],
    activityEventGroupBy: [],
    tenantUserFindMany: [],
    assetAggregate: [],
  };

  const fakePrisma = {
    site: {
      findFirst: async (args: { where?: { id?: string; tenantId?: string } }) => {
        calls.siteFindFirst.push(args);

        if (options.site === null) {
          return null;
        }

        return (
          options.site ?? {
            id: args.where?.id ?? 'site_a',
            name: 'Site A',
            slug: 'site-a',
          }
        );
      },
    },
    activityEvent: {
      findMany: async (args: {
        take?: number;
        distinct?: string[];
        select?: { type?: boolean };
      }) => {
        calls.activityEventFindMany.push(args);

        if (args.distinct?.includes('actorTenantUserId')) {
          return (options.activeMemberIds ?? []).map((actorTenantUserId) => ({
            actorTenantUserId,
          }));
        }

        if (args.take === 10) {
          return options.recentActivityEvents ?? [];
        }

        return options.contentActivityEvents ?? [];
      },
      groupBy: async (args: unknown) => {
        calls.activityEventGroupBy.push(args);
        return options.collaboratorActivity ?? [];
      },
    },
    tenantUser: {
      findMany: async (args: unknown) => {
        calls.tenantUserFindMany.push(args);
        return options.collaborators ?? [];
      },
    },
    asset: {
      aggregate: async (args: unknown) => {
        calls.assetAggregate.push(args);
        return {
          _sum: { byteSize: options.storageBytes ?? 0n },
          _count: { _all: options.assetCount ?? 0 },
        };
      },
    },
    $queryRaw: async () => [{ ok: 1 }],
  } as unknown as DashboardPrisma;

  return { fakePrisma, calls };
};

test('getSummary scopes dashboard queries to the requested tenant site', async () => {
  const { fakePrisma, calls } = createFakePrisma({
    collaboratorActivity: [
      {
        actorTenantUserId: 'tenant_user_1',
        _max: { createdAt: new Date('2026-07-01T10:00:00.000Z') },
      },
    ],
    collaborators: [
      {
        id: 'tenant_user_1',
        userId: 'user_1',
        roleId: 'role_1',
        user: { email: 'one@example.com' },
      },
    ],
  });
  const service = new DashboardService(
    fakePrisma,
    undefined,
    () => new Date('2026-07-01T12:00:00.000Z'),
  );

  await service.getSummary({ tenantId: 'tenant_a', siteId: 'site_a' });

  const siteLookupCall = calls.siteFindFirst[0] as {
    where?: { id?: string; tenantId?: string };
  };
  assert.equal(siteLookupCall.where?.tenantId, 'tenant_a');
  assert.equal(siteLookupCall.where?.id, 'site_a');

  const siteScopedCalls = [
    ...calls.activityEventFindMany,
    ...calls.activityEventGroupBy,
    ...calls.assetAggregate,
  ] as Array<{ where?: { tenantId?: string; siteId?: string } }>;

  assert.equal(siteScopedCalls.length, 5);

  for (const call of siteScopedCalls) {
    assert.equal(call.where?.tenantId, 'tenant_a');
    assert.equal(call.where?.siteId, 'site_a');
  }

  const collaboratorLookupCall = calls.tenantUserFindMany[0] as {
    where?: { tenantId?: string; id?: { in?: string[] } };
  };
  assert.equal(collaboratorLookupCall.where?.tenantId, 'tenant_a');
  assert.deepEqual(collaboratorLookupCall.where?.id?.in, ['tenant_user_1']);
});

test('getSummary rejects a site outside of the authenticated tenant scope', async () => {
  const { fakePrisma, calls } = createFakePrisma({ site: null });
  const service = new DashboardService(fakePrisma);

  await assert.rejects(
    () => service.getSummary({ tenantId: 'tenant_a', siteId: 'site_b' }),
    /Site not found/,
  );

  assert.equal(calls.activityEventFindMany.length, 0);
  assert.equal(calls.assetAggregate.length, 0);
});

test('aggregates content velocity and storage metrics for the requested site window', async () => {
  const now = new Date('2026-07-01T12:00:00.000Z');
  const { fakePrisma, calls } = createFakePrisma({
    contentActivityEvents: [
      { type: 'CONTENT_CREATED', createdAt: new Date('2026-06-30T10:00:00.000Z') },
      { type: 'CONTENT_UPDATED', createdAt: new Date('2026-06-30T11:00:00.000Z') },
      { type: 'CONTENT_PUBLISHED', createdAt: new Date('2026-07-01T09:00:00.000Z') },
      { type: 'CONTENT_UPDATED', createdAt: new Date('2026-05-20T09:00:00.000Z') },
    ],
    storageBytes: 12_582_912n,
    assetCount: 3,
  });
  const service = new DashboardService(fakePrisma, undefined, () => now);

  const [contentVelocity, storageUsed] = await Promise.all([
    service.getContentVelocity({ tenantId: 'tenant_a', siteId: 'site_a' }, now),
    service.getStorageUsed({ tenantId: 'tenant_a', siteId: 'site_a' }),
  ]);

  assert.equal(contentVelocity.created, 1);
  assert.equal(contentVelocity.updated, 1);
  assert.equal(contentVelocity.published, 1);
  assert.equal(contentVelocity.total, 3);
  assert.equal(contentVelocity.daily.find((day) => day.date === '2026-06-30')?.total, 2);
  assert.equal(contentVelocity.daily.find((day) => day.date === '2026-07-01')?.total, 1);
  assert.equal(storageUsed.totalBytes, '12582912');
  assert.equal(storageUsed.assetCount, 3);

  const velocityCall = calls.activityEventFindMany[0] as {
    where?: {
      tenantId?: string;
      siteId?: string;
      type?: { in?: string[] };
      createdAt?: { gte?: Date; lte?: Date };
    };
  };
  assert.equal(velocityCall.where?.tenantId, 'tenant_a');
  assert.equal(velocityCall.where?.siteId, 'site_a');
  assert.deepEqual(velocityCall.where?.type?.in, [
    'CONTENT_CREATED',
    'CONTENT_UPDATED',
    'CONTENT_PUBLISHED',
  ]);
  assert.equal(velocityCall.where?.createdAt?.gte?.toISOString(), '2026-06-02T00:00:00.000Z');
  assert.equal(velocityCall.where?.createdAt?.lte?.toISOString(), now.toISOString());

  const storageCall = calls.assetAggregate[0] as {
    where?: { tenantId?: string; siteId?: string };
  };
  assert.equal(storageCall.where?.tenantId, 'tenant_a');
  assert.equal(storageCall.where?.siteId, 'site_a');
});

test('derives active users and recent collaborators from site activity events', async () => {
  const now = new Date('2026-07-01T12:00:00.000Z');
  const { fakePrisma, calls } = createFakePrisma({
    activeMemberIds: ['tenant_user_1', 'tenant_user_2'],
    collaboratorActivity: [
      {
        actorTenantUserId: 'tenant_user_2',
        _max: { createdAt: new Date('2026-07-01T10:00:00.000Z') },
      },
      {
        actorTenantUserId: 'tenant_user_1',
        _max: { createdAt: new Date('2026-06-30T09:00:00.000Z') },
      },
    ],
    collaborators: [
      {
        id: 'tenant_user_1',
        userId: 'user_1',
        roleId: 'role_1',
        user: { email: 'one@example.com' },
      },
      {
        id: 'tenant_user_2',
        userId: 'user_2',
        roleId: 'role_2',
        user: { email: 'two@example.com' },
      },
    ],
  });
  const service = new DashboardService(fakePrisma, undefined, () => now);

  const [activeUsers, recentCollaborators] = await Promise.all([
    service.getActiveUsers({ tenantId: 'tenant_a', siteId: 'site_a' }, now),
    service.getRecentCollaborators({ tenantId: 'tenant_a', siteId: 'site_a' }),
  ]);

  assert.equal(activeUsers.count, 2);
  assert.deepEqual(
    recentCollaborators.map((collaborator) => collaborator.email),
    ['two@example.com', 'one@example.com'],
  );
  assert.equal('lastActivityAt' in recentCollaborators[0], false);

  const activeUsersCall = calls.activityEventFindMany[0] as {
    where?: {
      tenantId?: string;
      siteId?: string;
      actorTenantUser?: { user?: { isActive?: boolean } };
    };
    distinct?: string[];
  };
  assert.equal(activeUsersCall.where?.tenantId, 'tenant_a');
  assert.equal(activeUsersCall.where?.siteId, 'site_a');
  assert.equal(activeUsersCall.where?.actorTenantUser?.user?.isActive, true);
  assert.deepEqual(activeUsersCall.distinct, ['actorTenantUserId']);

  const collaboratorActivityCall = calls.activityEventGroupBy[0] as {
    where?: {
      tenantId?: string;
      siteId?: string;
      actorTenantUser?: { user?: { isActive?: boolean } };
    };
  };
  assert.equal(collaboratorActivityCall.where?.tenantId, 'tenant_a');
  assert.equal(collaboratorActivityCall.where?.siteId, 'site_a');
  assert.equal(collaboratorActivityCall.where?.actorTenantUser?.user?.isActive, true);
});
