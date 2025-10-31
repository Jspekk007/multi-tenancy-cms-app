import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

export const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { auth = true, retry = true, headers, ...rest } = options;
  const token = Cookies.get('token');

  let normalizedHeaders: Record<string, string> = {};

  if (headers && !(headers instanceof Headers) && !Array.isArray(headers)) {
    normalizedHeaders = headers as Record<string, string>;
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...normalizedHeaders,
  };

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
    credentials: 'include',
  });

  if (response.ok) {
    return (await response.json()) as T;
  }

  if (response.status === 401 && retry) {
    const refreshSuccess = await tryRefreshToken();

    if (refreshSuccess) {
      return apiFetch<T>(endpoint, { ...options, retry: false });
    }

    handleLogout();
  }

  const errorText = await safeParseError(response);
  throw new Error(errorText || 'Unknown API error');
};

const safeParseError = async (response: Response): Promise<string> => {
  try {
    const data: unknown = await response.json();

    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: string }).message;
      return message ?? JSON.stringify(data);
    }

    return JSON.stringify(data);
  } catch {
    return response.statusText || 'Unknown API error';
  }
};

const tryRefreshToken = async (): Promise<boolean> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) return false;

  try {
    const data = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (data && typeof data === 'object' && 'token' in data && 'refreshToken' in data) {
      const { token: newToken, refreshToken: newRefreshToken } = data as {
        token: string;
        refreshToken: string;
      };

      Cookies.set('token', newToken);
      Cookies.set('refreshToken', newRefreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const handleLogout = (): void => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
