'use client';

import { useEffect } from 'react';

import { setAuthCookies } from '@/lib/authCookies';

const DEFAULT_REDIRECT = '/dashboard';

const sanitizeInternalRedirect = (value: string | null, fallback = DEFAULT_REDIRECT): string => {
  const input = value?.trim();

  if (!input) {
    return fallback;
  }

  // Only allow internal absolute paths.
  // Allows: /dashboard, /settings?tab=profile
  // Blocks: https://evil.com, //evil.com, javascript:alert(1), dashboard
  if (!input.startsWith('/')) {
    return fallback;
  }

  // Block protocol-relative URLs.
  if (input.startsWith('//')) {
    return fallback;
  }

  // Block backslash-based browser quirks.
  if (input.includes('\\')) {
    return fallback;
  }

  try {
    const decodedInput = decodeURIComponent(input);

    if (
      !decodedInput.startsWith('/') ||
      decodedInput.startsWith('//') ||
      decodedInput.includes('\\')
    ) {
      return fallback;
    }

    const url = new URL(input, window.location.origin);

    if (url.origin !== window.location.origin) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
};

export default function AuthContinuePage(): JSX.Element {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));

    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const redirect = sanitizeInternalRedirect(params.get('redirect'));

    // Remove tokens from the visible URL as soon as possible.
    window.history.replaceState(null, '', window.location.pathname);

    if (!token || !refreshToken) {
      window.location.replace('/login');
      return;
    }

    setAuthCookies(token, refreshToken);
    window.location.replace(redirect);
  }, []);

  return <main aria-busy="true" />;
}
