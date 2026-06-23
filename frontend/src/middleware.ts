import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getTenantSlugFromHostname } from '@/lib/tenantUrl';

const PUBLIC_ROUTES = ['/login', '/register', '/passwordReset', '/auth/continue'];
const ROOT_ONLY_PUBLIC_ROUTES = ['/login', '/register', '/passwordReset'];
const PUBLIC_FILE_PATTERN = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$/i;

const getRequestHost = (request: NextRequest): string => {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost ?? request.headers.get('host') ?? request.nextUrl.host;

  return host.split(',')[0].trim().toLowerCase();
};

const getRequestHostname = (request: NextRequest): string => {
  return getRequestHost(request).split(':')[0];
};

const getRequestPort = (request: NextRequest): string => {
  const port = getRequestHost(request).split(':')[1];

  return /^\d+$/.test(port ?? '') ? port : '';
};

const getRequestProtocol = (request: NextRequest): string => {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  if (forwardedProto) {
    return `${forwardedProto}:`;
  }

  return process.env.NODE_ENV === 'development' ? 'http:' : request.nextUrl.protocol;
};

const buildRootUrl = (request: NextRequest, pathname: string): URL => {
  const configuredMainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL;
  if (configuredMainAppUrl) {
    return new URL(pathname, configuredMainAppUrl);
  }

  const hostname = getRequestHostname(request);
  const rootHostname =
    hostname.endsWith('.lvh.me') || hostname.endsWith('.localhost')
      ? 'localhost'
      : hostname.split('.').slice(1).join('.') || hostname;
  const port = getRequestPort(request);
  const rootOrigin = `${getRequestProtocol(request)}//${rootHostname}${port ? `:${port}` : ''}`;

  return new URL(pathname, rootOrigin);
};

const buildRootLoginUrl = (request: NextRequest, tenantSlug: string, returnTo: string): URL => {
  const loginUrl = buildRootUrl(request, '/login');

  loginUrl.search = '';
  loginUrl.searchParams.set('tenant', tenantSlug);
  loginUrl.searchParams.set('returnTo', returnTo);

  return loginUrl;
};

const redirectToAbsoluteUrl = (url: URL): NextResponse => {
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: url.toString(),
    },
  });
};

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const tenantSlug = getTenantSlugFromHostname(getRequestHostname(request));

  if (PUBLIC_FILE_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isRootOnlyPublicRoute = ROOT_ONLY_PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (tenantSlug && isRootOnlyPublicRoute) {
    if (pathname.startsWith('/login')) {
      return redirectToAbsoluteUrl(buildRootLoginUrl(request, tenantSlug, '/dashboard'));
    }

    return redirectToAbsoluteUrl(buildRootUrl(request, pathname));
  }

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    if (tenantSlug) {
      return redirectToAbsoluteUrl(
        buildRootLoginUrl(
          request,
          tenantSlug,
          `${request.nextUrl.pathname}${request.nextUrl.search}`,
        ),
      );
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname.startsWith('/login') && request.nextUrl.searchParams.has('tenant')) {
    return NextResponse.next();
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.svg).*)',
  ],
};
