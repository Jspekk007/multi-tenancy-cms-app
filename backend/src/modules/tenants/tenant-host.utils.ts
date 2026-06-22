import type { Request } from 'express';

import { isReservedTenantSlug, normalizeTenantSlug } from './tenant-slug.utils';

const ROOT_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'lvh.me']);

const extractHostname = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return value.split(':')[0]?.toLowerCase();
  }
};

export const extractTenantSlugFromHostname = (hostname: string | undefined): string | undefined => {
  if (!hostname || ROOT_HOSTNAMES.has(hostname)) {
    return undefined;
  }

  const labels = hostname.split('.');
  const candidate = labels[0];

  if (!candidate || labels.length < 2) {
    return undefined;
  }

  const slug = normalizeTenantSlug(candidate);
  return isReservedTenantSlug(slug) ? undefined : slug;
};

export const getTenantSlugFromRequest = (req: Request): string | undefined => {
  const headerValue = req.headers['x-tenant-slug'];
  const tenantSlugHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  if (tenantSlugHeader) {
    const slug = normalizeTenantSlug(tenantSlugHeader);
    return isReservedTenantSlug(slug) ? undefined : slug;
  }

  return (
    extractTenantSlugFromHostname(extractHostname(req.headers.origin)) ??
    extractTenantSlugFromHostname(extractHostname(req.headers.host))
  );
};
