const ROOT_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'lvh.me']);
const RESERVED_TENANT_SLUGS = new Set([
  'admin',
  'api',
  'app',
  'localhost',
  'login',
  'register',
  'www',
]);

export const normalizeTenantSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getTenantSlugFromHostname = (hostname: string): string | null => {
  const normalizedHostname = hostname.toLowerCase();

  if (ROOT_HOSTNAMES.has(normalizedHostname)) {
    return null;
  }

  const candidate = normalizedHostname.split('.')[0];
  if (!candidate) {
    return null;
  }

  const slug = normalizeTenantSlug(candidate);
  return RESERVED_TENANT_SLUGS.has(slug) || /^\d+$/.test(slug) ? null : slug;
};

export const getCurrentTenantSlug = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return getTenantSlugFromHostname(window.location.hostname);
};

const getConfiguredTenantBaseHost = (): string | undefined =>
  process.env.NEXT_PUBLIC_TENANT_BASE_HOST?.replace(/^\./, '').toLowerCase();

const getRootHostname = (hostname: string): string => {
  const normalizedHostname = hostname.toLowerCase();

  if (normalizedHostname.endsWith('.lvh.me') || normalizedHostname.endsWith('.localhost')) {
    return 'localhost';
  }

  return normalizedHostname.split('.').slice(1).join('.') || normalizedHostname;
};

const getTenantBaseHost = (): string | undefined => {
  const configuredBaseHost = getConfiguredTenantBaseHost();
  if (configuredBaseHost) {
    return configuredBaseHost;
  }

  if (typeof window === 'undefined') {
    return undefined;
  }

  const hostname = window.location.hostname.toLowerCase();

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return 'lvh.me';
  }

  if (hostname === 'lvh.me' || hostname.endsWith('.lvh.me')) {
    return 'lvh.me';
  }

  if (hostname.endsWith('.localhost')) {
    return 'localhost';
  }

  return undefined;
};

const createRootLoginUrl = (tenantSlug: string, returnTo: string): string => {
  if (typeof window === 'undefined') {
    return '/login';
  }

  const configuredMainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL;
  const loginUrl = configuredMainAppUrl
    ? new URL('/login', configuredMainAppUrl)
    : new URL('/login', window.location.origin);

  if (!configuredMainAppUrl) {
    loginUrl.hostname = getRootHostname(window.location.hostname);
  }

  loginUrl.searchParams.set('tenant', tenantSlug);
  loginUrl.searchParams.set('returnTo', returnTo);

  return loginUrl.toString();
};

export const getLoginUrlForCurrentLocation = (returnTo?: string): string => {
  if (typeof window === 'undefined') {
    return '/login';
  }

  const tenantSlug = getCurrentTenantSlug();
  if (!tenantSlug) {
    return '/login';
  }

  return createRootLoginUrl(
    tenantSlug,
    returnTo ?? `${window.location.pathname}${window.location.search}`,
  );
};

export const redirectToLogin = (returnTo?: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.location.assign(getLoginUrlForCurrentLocation(returnTo));
};

export const getSharedCookieDomain = (): string | undefined => {
  const configuredCookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (configuredCookieDomain) {
    return configuredCookieDomain;
  }

  return undefined;
};

interface TenantNavigationAuth {
  token: string;
  refreshToken: string;
}

const requiresLocalAuthHandoff = (targetUrl: string, auth?: TenantNavigationAuth): boolean => {
  if (!auth || typeof window === 'undefined' || !targetUrl.startsWith('http')) {
    return false;
  }

  const currentHostname = window.location.hostname.toLowerCase();
  const isLocalRootHost =
    currentHostname === 'localhost' ||
    currentHostname === '127.0.0.1' ||
    currentHostname === '0.0.0.0';

  return isLocalRootHost && new URL(targetUrl).origin !== window.location.origin;
};

const createLocalAuthHandoffUrl = (
  targetUrl: string,
  path: string,
  auth: TenantNavigationAuth,
): string => {
  const url = new URL(targetUrl);
  const params = new URLSearchParams({
    token: auth.token,
    refreshToken: auth.refreshToken,
    redirect: path,
  });

  url.pathname = '/auth/continue';
  url.search = '';
  url.hash = params.toString();

  return url.toString();
};

export const buildTenantUrl = (tenantSlug: string, path = '/dashboard'): string => {
  if (typeof window === 'undefined') {
    return path;
  }

  const currentTenantSlug = getCurrentTenantSlug();
  if (currentTenantSlug === tenantSlug) {
    return path;
  }

  const tenantBaseHost = getTenantBaseHost();
  if (!tenantBaseHost) {
    return path;
  }

  const port = window.location.port ? `:${window.location.port}` : '';
  return `${window.location.protocol}//${tenantSlug}.${tenantBaseHost}${port}${path}`;
};

export const navigateToTenant = (
  tenantSlug: string,
  path = '/dashboard',
  auth?: TenantNavigationAuth,
): void => {
  const url = buildTenantUrl(tenantSlug, path);

  if (url.startsWith('http')) {
    if (auth && requiresLocalAuthHandoff(url, auth)) {
      window.location.assign(createLocalAuthHandoffUrl(url, path, auth));
      return;
    }

    window.location.assign(url);
    return;
  }

  window.location.href = url;
};
