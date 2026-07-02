export type DashboardHealthStatus = 'operational' | 'degraded' | 'unavailable' | 'unknown';

export interface DashboardHealthCheck {
  status: DashboardHealthStatus;
  checkedAt: Date;
  detail?: string;
}

export interface DashboardContentVelocityDay {
  date: string;
  created: number;
  updated: number;
  published: number;
  total: number;
}

export interface DashboardContentVelocity {
  windowDays: 30;
  startDate: Date;
  endDate: Date;
  created: number;
  updated: number;
  published: number;
  total: number;
  daily: DashboardContentVelocityDay[];
}

export interface DashboardActiveUsers {
  windowDays: 7;
  startDate: Date;
  endDate: Date;
  count: number;
}

export interface DashboardStorageUsed {
  totalBytes: string;
  assetCount: number;
}

export interface DashboardSite {
  id: string;
  name: string;
  slug: string;
}

export interface DashboardActivityEvent {
  id: string;
  type: string;
  description: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: Date;
  actor: {
    id: string;
    email: string;
  } | null;
}

export interface DashboardCollaborator {
  tenantUserId: string;
  userId: string;
  email: string;
  roleId: string;
}

export interface DashboardInfraHealth {
  app: DashboardHealthCheck;
  database: DashboardHealthCheck;
  storage: DashboardHealthCheck;
  queue: DashboardHealthCheck;
}

export interface DashboardSummary {
  site: DashboardSite;
  contentVelocity: DashboardContentVelocity;
  activeUsers: DashboardActiveUsers;
  storageUsed: DashboardStorageUsed;
  recentActivity: DashboardActivityEvent[];
  infraHealth: DashboardInfraHealth;
  recentCollaborators: DashboardCollaborator[];
}
