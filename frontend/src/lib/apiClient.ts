import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface FetchOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

/**
 * Main API Fetcher
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { auth = true, retry = true, headers, ...rest } = options;
  const token = Cookies.get("token");

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth && token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
    credentials: "include",
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401 && retry) {
    const refreshSuccess = await tryRefreshToken();

    if (refreshSuccess) {
      return apiFetch(endpoint, { ...options, retry: false });
    }

    handleLogout();
    throw new Error("Session expired. Please log in again.");
  }

  const errorText = await safeParseError(response);
  throw new Error(errorText || "Unknown API error");
};

const safeParseError = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || JSON.stringify(data);
  } catch {
    return response.statusText;
  }
};

const tryRefreshToken = async (): Promise<boolean> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;
    const data = await res.json();

    const { token: newToken, refreshToken: newRefreshToken } = data;

    Cookies.set("token", newToken);
    Cookies.set("refreshToken", newRefreshToken);
    return true;
  } catch {
    return false;
  }
};

const handleLogout = (): void => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  window.location.href = "/login";
};
