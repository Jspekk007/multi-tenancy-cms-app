const RESERVED_TENANT_SLUGS = new Set([
  'admin',
  'api',
  'app',
  'localhost',
  'login',
  'register',
  'www',
]);

const DEFAULT_TENANT_SLUG = 'workspace';
const MAX_TENANT_SLUG_LENGTH = 64;

export const normalizeTenantSlug = (value: string): string => {
  let slug = '';
  let previousWasDash = false;

  for (const char of value.trim().toLowerCase()) {
    const code = char.charCodeAt(0);

    const isLowercaseLetter = code >= 97 && code <= 122; // a-z
    const isNumber = code >= 48 && code <= 57; // 0-9

    if (isLowercaseLetter || isNumber) {
      slug += char;
      previousWasDash = false;
    } else if (!previousWasDash && slug.length > 0) {
      slug += '-';
      previousWasDash = true;
    }

    if (slug.length >= MAX_TENANT_SLUG_LENGTH) {
      break;
    }
  }

  if (slug.endsWith('-')) {
    slug = slug.slice(0, -1);
  }

  return slug || DEFAULT_TENANT_SLUG;
};

export const isReservedTenantSlug = (slug: string): boolean =>
  RESERVED_TENANT_SLUGS.has(slug) || /^\d+$/.test(slug);
