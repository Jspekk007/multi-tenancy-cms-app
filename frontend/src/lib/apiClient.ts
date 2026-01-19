import Cookies from 'js-cookie';

import { ApiError, ApiErrorResponse } from '@/types/error';
import { isApiErrorResponse } from '@/utils/isApiErrorResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

const safeParseJSON = async (res: Response): Promise<ApiErrorResponse | null> => {
  try {
    const contentType = res.headers.get('content-type');
    // Only attempt JSON parsing if the content type is JSON
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    const json = await res.json();

    // Use your type guard to confirm the shape
    if (isApiErrorResponse(json)) {
      return json;
    }
    return null;
  } catch {
    return null;
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

const handleLogout = (): void => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { auth = true, retry = true, headers, ...rest } = options;
  const authToken = Cookies.get('token');

  // Normalize headers (same as before)
  const normalizedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers && !(headers instanceof Headers) && !Array.isArray(headers)
      ? (headers as Record<string, string>)
      : {}),
  };

  if (auth && authToken) {
    normalizedHeaders.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: normalizedHeaders,
      credentials: 'include',
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    // --- Start Error Handling ---

    // 1. Token Refresh
    if (response.status === 401 && retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiFetch<T>(endpoint, { ...options, retry: false });
      }
      handleLogout();
      throw new ApiError({
        message: 'Session expired. Please login again.',
        httpStatus: 401,
        code: 'SESSION_EXPIRED',
      });
    }

    // 2. Parse the API's custom error response body (REST path)
    const errorBody = await safeParseJSON(response);

    if (errorBody) {
      // The error body conforms to ApiErrorResponse
      throw new ApiError({
        message: errorBody.message,
        code: errorBody.code,
        httpStatus: errorBody.status, // Use the 'status' field from the response body
        details: errorBody.details,
        correlationId: errorBody.correlationId,
        cause: errorBody.cause,
      });
    }

    throw new ApiError({
      message: response.statusText || 'Unknown API error',
      httpStatus: response.status,
      code: 'UNKNOWN',
      details: await response.text().catch(() => 'No body'),
    });
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;

    const message = err instanceof Error ? err.message : 'Network error';

    throw new ApiError({
      message: message,
      httpStatus: 0,
      code: 'NETWORK_ERROR',
      cause: err,
    });
  }
};
