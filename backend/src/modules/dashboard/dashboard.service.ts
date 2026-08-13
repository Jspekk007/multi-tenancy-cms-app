import { prismaClient } from '@backend/lib/prisma';
import { ErrorFactory } from '@backend/modules/error/ErrorFactory';
import type { ActivityEventType, PrismaClient } from '@prisma/client';
import type { JobType } from 'bullmq';

import type {
  DashboardActiveUsers,
  DashboardActivityEvent,
  DashboardCollaborator,
  DashboardContentVelocity,
  DashboardContentVelocityDay,
  DashboardHealthCheck,
  DashboardInfraHealth,
  DashboardSite,
  DashboardStorageUsed,
  DashboardSummary,
} from './dashboard.types';

type DashboardPrismaClient = Pick<
  PrismaClient,
  'activityEvent' | 'asset' | 'site' | 'tenantUser' | '$queryRaw'
>;

interface DashboardScope {
  tenantId: string;
  siteId: string;
}

interface QueueHealthClient {
  getJobCounts: (...statuses: JobType[]) => Promise<Record<string, number>>;
}

type ContentActivityType = Extract<
  ActivityEventType,
  'CONTENT_CREATED' | 'CONTENT_UPDATED' | 'CONTENT_PUBLISHED'
>;

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CONTENT_VELOCITY_DAYS = 30;
const ACTIVE_USER_DAYS = 7;

const CONTENT_ACTIVITY_TYPES = [
  'CONTENT_CREATED',
  'CONTENT_UPDATED',
  'CONTENT_PUBLISHED',
] satisfies ContentActivityType[];

const QUEUE_HEALTH_STATUSES = ['waiting', 'active', 'delayed', 'failed'] satisfies JobType[];

const toUtcDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const startOfUtcDay = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_IN_MS);

const createEmptyVelocityDay = (date: Date): DashboardContentVelocityDay => ({
  date: toUtcDateKey(date),
  created: 0,
  updated: 0,
  published: 0,
  total: 0,
});

const toStorageByteString = (value: bigint | number | null | undefined): string => {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  return String(value ?? 0);
};

export class DashboardService {
  constructor(
    private readonly prisma: DashboardPrismaClient = prismaClient,
    private readonly queueClient?: QueueHealthClient,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getSummary(scope: DashboardScope): Promise<DashboardSummary> {
    const now = this.now();
    const site = await this.getTenantSite(scope);

    const [
      contentVelocity,
      activeUsers,
      storageUsed,
      recentActivity,
      infraHealth,
      recentCollaborators,
    ] = await Promise.all([
      this.getContentVelocity(scope, now),
      this.getActiveUsers(scope, now),
      this.getStorageUsed(scope),
      this.getRecentActivity(scope),
      this.getInfraHealth(now),
      this.getRecentCollaborators(scope),
    ]);

    return {
      site,
      contentVelocity,
      activeUsers,
      storageUsed,
      recentActivity,
      infraHealth,
      recentCollaborators,
    };
  }

  async getContentVelocity(
    { tenantId, siteId }: DashboardScope,
    now = this.now(),
  ): Promise<DashboardContentVelocity> {
    const endDate = now;
    const startDate = addDays(startOfUtcDay(now), -(CONTENT_VELOCITY_DAYS - 1));
    const daily = Array.from({ length: CONTENT_VELOCITY_DAYS }, (_, index) =>
      createEmptyVelocityDay(addDays(startDate, index)),
    );
    const daysByDate = new Map(daily.map((day) => [day.date, day]));

    const events = await this.prisma.activityEvent.findMany({
      where: {
        tenantId,
        siteId,
        type: { in: CONTENT_ACTIVITY_TYPES },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        type: true,
        createdAt: true,
      },
    });

    for (const event of events) {
      const day = daysByDate.get(toUtcDateKey(event.createdAt));
      if (!day) {
        continue;
      }

      if (event.type === 'CONTENT_CREATED') {
        day.created += 1;
      } else if (event.type === 'CONTENT_UPDATED') {
        day.updated += 1;
      } else if (event.type === 'CONTENT_PUBLISHED') {
        day.published += 1;
      }

      day.total += 1;
    }

    return {
      windowDays: CONTENT_VELOCITY_DAYS,
      startDate,
      endDate,
      created: daily.reduce((total, day) => total + day.created, 0),
      updated: daily.reduce((total, day) => total + day.updated, 0),
      published: daily.reduce((total, day) => total + day.published, 0),
      total: daily.reduce((total, day) => total + day.total, 0),
      daily,
    };
  }

  async getActiveUsers(
    { tenantId, siteId }: DashboardScope,
    now = this.now(),
  ): Promise<DashboardActiveUsers> {
    const endDate = now;
    const startDate = new Date(now.getTime() - ACTIVE_USER_DAYS * DAY_IN_MS);
    const activeMembers = await this.prisma.activityEvent.findMany({
      where: {
        tenantId,
        siteId,
        actorTenantUserId: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        actorTenantUser: {
          user: {
            isActive: true,
          },
        },
      },
      distinct: ['actorTenantUserId'],
      select: {
        actorTenantUserId: true,
      },
    });

    return {
      windowDays: ACTIVE_USER_DAYS,
      startDate,
      endDate,
      count: activeMembers.length,
    };
  }

  async getStorageUsed({ tenantId, siteId }: DashboardScope): Promise<DashboardStorageUsed> {
    const aggregate = await this.prisma.asset.aggregate({
      where: { tenantId, siteId },
      _count: { _all: true },
      _sum: { byteSize: true },
    });

    return {
      totalBytes: toStorageByteString(aggregate._sum.byteSize),
      assetCount: aggregate._count._all,
    };
  }

  async getRecentActivity({ tenantId, siteId }: DashboardScope): Promise<DashboardActivityEvent[]> {
    const events = await this.prisma.activityEvent.findMany({
      where: { tenantId, siteId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        description: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        actorTenantUser: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      description: event.description,
      entityType: event.entityType,
      entityId: event.entityId,
      createdAt: event.createdAt,
      actor: event.actorTenantUser
        ? {
            id: event.actorTenantUser.user.id,
            email: event.actorTenantUser.user.email,
          }
        : null,
    }));
  }

  async getRecentCollaborators({
    tenantId,
    siteId,
  }: DashboardScope): Promise<DashboardCollaborator[]> {
    const collaboratorActivity = await this.prisma.activityEvent.groupBy({
      by: ['actorTenantUserId'],
      where: {
        tenantId,
        siteId,
        actorTenantUserId: { not: null },
        actorTenantUser: {
          user: {
            isActive: true,
          },
        },
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        _max: {
          createdAt: 'desc',
        },
      },
      take: 5,
    });
    const collaboratorIds = collaboratorActivity
      .map((collaborator) => collaborator.actorTenantUserId)
      .filter((collaboratorId): collaboratorId is string => Boolean(collaboratorId));

    if (!collaboratorIds.length) {
      return [];
    }

    const collaborators = await this.prisma.tenantUser.findMany({
      where: {
        tenantId,
        id: { in: collaboratorIds },
        user: {
          isActive: true,
        },
      },
      select: {
        id: true,
        userId: true,
        roleId: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    const collaboratorsById = new Map(
      collaborators.map((collaborator) => [collaborator.id, collaborator]),
    );

    return collaboratorActivity.flatMap((activity) => {
      if (!activity.actorTenantUserId || !activity._max.createdAt) {
        return [];
      }

      const collaborator = collaboratorsById.get(activity.actorTenantUserId);
      if (!collaborator) {
        return [];
      }

      return [
        {
          tenantUserId: collaborator.id,
          userId: collaborator.userId,
          email: collaborator.user.email,
          roleId: collaborator.roleId,
        },
      ];
    });
  }

  private async getTenantSite({ tenantId, siteId }: DashboardScope): Promise<DashboardSite> {
    const site = await this.prisma.site.findFirst({
      where: {
        id: siteId,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!site) {
      throw ErrorFactory.notFound('Site not found');
    }

    return site;
  }

  async getInfraHealth(now = this.now()): Promise<DashboardInfraHealth> {
    const [database, queue] = await Promise.all([
      this.getDatabaseHealth(now),
      this.getQueueHealth(now),
    ]);

    return {
      app: {
        status: 'operational',
        checkedAt: now,
        detail: 'Application process is responding.',
      },
      database,
      storage: {
        status: 'unknown',
        checkedAt: now,
        detail: 'No storage provider health check is configured.',
      },
      queue,
    };
  }

  private async getDatabaseHealth(now: Date): Promise<DashboardHealthCheck> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'operational',
        checkedAt: now,
        detail: 'Database query succeeded.',
      };
    } catch {
      return {
        status: 'unavailable',
        checkedAt: now,
        detail: 'Database health query failed.',
      };
    }
  }

  private async getQueueHealth(now: Date): Promise<DashboardHealthCheck> {
    if (!this.queueClient) {
      return {
        status: 'unknown',
        checkedAt: now,
        detail: 'Queue client is not configured.',
      };
    }

    try {
      const counts = await this.queueClient.getJobCounts(...QUEUE_HEALTH_STATUSES);
      const failedJobs = counts.failed ?? 0;

      return {
        status: failedJobs > 0 ? 'degraded' : 'operational',
        checkedAt: now,
        detail: failedJobs > 0 ? 'Queue is reachable with failed jobs.' : 'Queue is reachable.',
      };
    } catch {
      return {
        status: 'unavailable',
        checkedAt: now,
        detail: 'Queue health check failed.',
      };
    }
  }
}
