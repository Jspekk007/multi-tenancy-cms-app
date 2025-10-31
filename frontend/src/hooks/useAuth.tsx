'use client';

import Cookies from 'js-cookie';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { apiFetch } from '@/lib/apiClient';
import { AuthContextType, AuthResponse, AuthUser, LoginInput } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = Cookies.get('token');
      const storedRefreshToken = Cookies.get('refreshToken');

      if (storedToken && storedRefreshToken) {
        try {
          // Verify current token
          const data = await apiFetch<AuthUser>('/auth/me');
          setUser(data);
          setToken(storedToken);
        } catch {
          // Try refreshing token
          try {
            const data = await apiFetch<AuthResponse>('/auth/refresh', {
              method: 'POST',
              body: JSON.stringify({ refreshToken: storedRefreshToken }),
              auth: false, // optional if apiFetch adds auth by default
            });

            const { token: newToken, refreshToken: newRefreshToken, user: userData } = data;

            Cookies.set('token', newToken, { expires: 1 });
            Cookies.set('refreshToken', newRefreshToken, { expires: 30 });

            setUser(userData);
            setToken(newToken);
          } catch {
            // Failed to refresh → logout
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginInput): Promise<void> => {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false,
    });

    const { user: userData, token: authToken, refreshToken } = data;

    Cookies.set('token', authToken, { expires: 1 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });

    setUser(userData);
    setToken(authToken);
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      setUser(null);
      setToken(null);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = Cookies.get('refreshToken');
      if (!refreshTokenValue) throw new Error('No refresh token');

      const data = await apiFetch<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
        auth: false,
      });

      const { token: newToken, refreshToken: newRefreshToken, user: userData } = data;

      Cookies.set('token', newToken, { expires: 1 });
      Cookies.set('refreshToken', newRefreshToken, { expires: 30 });

      setUser(userData);
      setToken(newToken);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
