import Cookies from 'js-cookie';

import { getSharedCookieDomain } from './tenantUrl';

const getCookieOptions = (expires?: number): Cookies.CookieAttributes => {
  const domain = getSharedCookieDomain();

  return {
    ...(expires ? { expires } : {}),
    ...(domain ? { domain } : {}),
    sameSite: 'lax',
  };
};

export const getAccessToken = (): string | undefined => Cookies.get('token');

export const getRefreshToken = (): string | undefined => Cookies.get('refreshToken');

export const setAccessToken = (token: string): void => {
  Cookies.set('token', token, getCookieOptions(1));
};

export const setRefreshToken = (refreshToken: string): void => {
  Cookies.set('refreshToken', refreshToken, getCookieOptions(30));
};

export const setAuthCookies = (token: string, refreshToken?: string): void => {
  setAccessToken(token);

  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

export const clearAuthCookies = (): void => {
  Cookies.remove('token', getCookieOptions());
  Cookies.remove('refreshToken', getCookieOptions());
  Cookies.remove('token');
  Cookies.remove('refreshToken');
};
