'use client';

import { useEffect } from 'react';

import { setAuthCookies } from '@/lib/authCookies';

export default function AuthContinuePage(): JSX.Element {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const redirect = params.get('redirect') || '/dashboard';

    window.history.replaceState(null, '', redirect);

    if (!token || !refreshToken) {
      window.location.replace('/login');
      return;
    }

    setAuthCookies(token, refreshToken);
    window.location.replace(redirect);
  }, []);

  return <main aria-busy="true" />;
}
