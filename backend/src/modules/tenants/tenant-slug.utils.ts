const RESERVED_TENANT_SLUGS = new Set([
  'admin',
  'api',
  'app',
  'localhost',
  'login',
  'register',
  'www',
]);

export const normalizeTenantSlug = (value: string): string => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'workspace';
};

export const isReservedTenantSlug = (slug: string): boolean =>
  RESERVED_TENANT_SLUGS.has(slug) || /^\d+$/.test(slug);
