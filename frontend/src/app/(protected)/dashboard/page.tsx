'use client';

import './page.scss';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorUtils';

import { trpc } from '../../../trpc/trpc';

const dashboardSkeletonCards = ['content', 'users', 'storage', 'activity'] as const;

const numberFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
});

const formatDailyActivityDate = (date: string): string =>
  dateFormatter.format(new Date(`${date}T00:00:00.000Z`));

const dateTimeFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const formatBytes = (value: string): string => {
  const bytes = Number.parseInt(value, 10);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;

  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const formatActivityType = (type: string): string =>
  type
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatHealthLabel = (status: string): string =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatDailyActivityCount = (total: number): string =>
  `${numberFormatter.format(total)} ${total === 1 ? 'event' : 'events'}`;

const CONTROL_CHARACTER_PATTERN = /\p{Control}/u;

const getCleanSiteName = (name: string): string | null => {
  const trimmedName = name.trim();

  return trimmedName.length && !CONTROL_CHARACTER_PATTERN.test(trimmedName) ? trimmedName : null;
};

export default function DashboardPage(): JSX.Element {
  const { activeSite, isLoadingSites } = useAuth();
  const activeSiteId = activeSite?.id ?? '';
  const dashboardQuery = trpc.dashboard.summary.useQuery(
    { siteId: activeSiteId },
    {
      enabled: Boolean(activeSite),
      staleTime: 30_000,
    },
  );

  const dashboard = dashboardQuery.data;
  const displaySiteName = dashboard?.site.name ?? activeSite?.name;
  const siteName = displaySiteName ? getCleanSiteName(displaySiteName) : null;
  const isEmpty =
    dashboard &&
    dashboard.contentVelocity.total === 0 &&
    dashboard.activeUsers.count === 0 &&
    dashboard.storageUsed.assetCount === 0 &&
    dashboard.recentActivity.length === 0 &&
    dashboard.recentCollaborators.length === 0;

  if (isLoadingSites || (Boolean(activeSite) && dashboardQuery.isLoading)) {
    return (
      <section className="dashboard" aria-busy="true">
        <div className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Site metrics</p>
            <h1>Dashboard</h1>
            {siteName ? <p className="dashboard__site-name">{siteName}</p> : null}
          </div>
        </div>
        <div className="dashboard__metrics">
          {dashboardSkeletonCards.map((card) => (
            <div className="dashboard-card dashboard-card--loading" key={card}>
              <span />
              <strong />
              <small />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!activeSite) {
    return (
      <section className="dashboard">
        <div className="dashboard__state">
          <p className="dashboard__eyebrow">Site metrics</p>
          <h1>No site selected</h1>
          <p>Select a site to view dashboard metrics.</p>
        </div>
      </section>
    );
  }

  if (dashboardQuery.error) {
    return (
      <section className="dashboard">
        <div className="dashboard__state dashboard__state--error" role="alert">
          <p className="dashboard__eyebrow">Dashboard unavailable</p>
          <h1>Could not load dashboard</h1>
          <p>{getErrorMessage(dashboardQuery.error)}</p>
          <button type="button" onClick={() => void dashboardQuery.refetch()}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!dashboard || isEmpty) {
    return (
      <section className="dashboard">
        <div className="dashboard__state">
          <p className="dashboard__eyebrow">Site metrics</p>
          <h1>No site activity</h1>
          <p>No activity has been recorded for this site yet.</p>
        </div>
      </section>
    );
  }

  const maxDailyActivity = Math.max(1, ...dashboard.contentVelocity.daily.map((day) => day.total));

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Site metrics</p>
          <h1>Dashboard</h1>
          {siteName ? <p className="dashboard__site-name">{siteName}</p> : null}
        </div>
        <p>Updated {dateTimeFormatter.format(dashboard.infraHealth.app.checkedAt)}</p>
      </div>

      <ul className="dashboard__metrics" aria-label="Site metrics">
        <li className="dashboard-card">
          <span>Content velocity</span>
          <strong>{numberFormatter.format(dashboard.contentVelocity.total)}</strong>
          <small>
            {numberFormatter.format(dashboard.contentVelocity.created)} created,{' '}
            {numberFormatter.format(dashboard.contentVelocity.updated)} updated,{' '}
            {numberFormatter.format(dashboard.contentVelocity.published)} published
          </small>
        </li>
        <li className="dashboard-card">
          <span>Active users</span>
          <strong>{numberFormatter.format(dashboard.activeUsers.count)}</strong>
          <small>Last {dashboard.activeUsers.windowDays} days</small>
        </li>
        <li className="dashboard-card">
          <span>Storage used</span>
          <strong>{formatBytes(dashboard.storageUsed.totalBytes)}</strong>
          <small>{numberFormatter.format(dashboard.storageUsed.assetCount)} assets</small>
        </li>
        <li className="dashboard-card">
          <span>Recent activity</span>
          <strong>{numberFormatter.format(dashboard.recentActivity.length)}</strong>
          <small>Latest site events</small>
        </li>
      </ul>

      <div className="dashboard__grid">
        <article className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <div>
              <h2 id="dashboard-content-velocity-heading">Content velocity</h2>
              <p>Last {dashboard.contentVelocity.windowDays} days</p>
            </div>
          </div>
          <div className="dashboard-velocity" aria-hidden="true">
            {dashboard.contentVelocity.daily.map((day) => (
              <div className="dashboard-velocity__day" key={day.date}>
                <span
                  style={{ height: `${Math.max(8, (day.total / maxDailyActivity) * 100)}%` }}
                  title={`${formatDailyActivityDate(day.date)}: ${formatDailyActivityCount(day.total)}`}
                />
                <small>{formatDailyActivityDate(day.date)}</small>
              </div>
            ))}
          </div>
          <table
            className="dashboard-velocity__data"
            aria-labelledby="dashboard-content-velocity-heading"
          >
            <caption>Daily content velocity counts</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Events</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.contentVelocity.daily.map((day) => (
                <tr key={day.date}>
                  <th scope="row">
                    <time dateTime={day.date}>{formatDailyActivityDate(day.date)}</time>
                  </th>
                  <td>{formatDailyActivityCount(day.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Infra health</h2>
              <p>Current checks</p>
            </div>
          </div>
          <ul className="dashboard-health" aria-label="Infrastructure health">
            {Object.entries(dashboard.infraHealth).map(([name, health]) => (
              <li className="dashboard-health__item" key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{health.detail}</span>
                </div>
                <span className={`dashboard-health__status is-${health.status}`}>
                  {formatHealthLabel(health.status)}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Latest site events</h2>
              <p>Latest 10 events</p>
            </div>
          </div>
          {dashboard.recentActivity.length ? (
            <ul className="dashboard-list">
              {dashboard.recentActivity.map((activity) => (
                <li className="dashboard-list__item" key={activity.id}>
                  <div>
                    <strong>{activity.description}</strong>
                    <span>
                      {formatActivityType(activity.type)}
                      {activity.actor ? ` by ${activity.actor.email}` : ''}
                    </span>
                  </div>
                  <time dateTime={activity.createdAt.toISOString()}>
                    {dateTimeFormatter.format(activity.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-panel__empty">No site activity events yet.</p>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Recent collaborators</h2>
              <p>Latest 5 members</p>
            </div>
          </div>
          {dashboard.recentCollaborators.length ? (
            <ul className="dashboard-list">
              {dashboard.recentCollaborators.map((collaborator) => (
                <li className="dashboard-list__item" key={collaborator.tenantUserId}>
                  <div>
                    <strong>{collaborator.email}</strong>
                    <span>Recently active collaborator</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-panel__empty">No collaborators yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}
