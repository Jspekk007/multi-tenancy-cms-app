'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import Cookies from 'js-cookie';
import React, { PropsWithChildren, useState } from 'react';
import superjson from 'superjson';

import { trpc } from '../trpc/trpc';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

const handleLogout = (): void => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');

  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

const tryRefreshToken = async (): Promise<boolean> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth.refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data?.token || !data?.refreshToken) return false;

    Cookies.set('token', data.token);
    Cookies.set('refreshToken', data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

export function TRPCProvider({ children }: PropsWithChildren): JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            refetchOnWindowFocus: false,
            retry: (failureCount: number, error: unknown): boolean => {
              // Don't retry on 401/403 errors
              if (error instanceof TRPCClientError) {
                const httpStatus = error.data?.httpStatus;
                if (httpStatus === 401 || httpStatus === 403) {
                  return false;
                }
              }
              return process.env.NODE_ENV === 'production' && failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: API_BASE_URL,
          transformer: superjson,
          headers() {
            const token = Cookies.get('token');
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          fetch: async (url, options) => {
            const response = await fetch(url, options);

            // Handle token refresh on 401 - but NOT for login/register endpoints
            const urlString = url.toString();
            const isAuthEndpoint =
              urlString.includes('/auth.login') || urlString.includes('/auth.register');

            if (response.status === 401 && options?.headers && !isAuthEndpoint) {
              const refreshed = await tryRefreshToken();
              if (refreshed) {
                // Retry the request with new token
                const newToken = Cookies.get('token');
                const newHeaders = new Headers(options.headers);
                if (newToken) {
                  newHeaders.set('Authorization', `Bearer ${newToken}`);
                }
                return fetch(url, { ...options, headers: newHeaders });
              }
              handleLogout();
            }

            return response;
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
