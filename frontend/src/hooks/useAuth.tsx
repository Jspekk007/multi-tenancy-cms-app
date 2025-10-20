'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { AuthContextType, AuthUser, LoginInput, AuthResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get('token');
      const storedRefreshToken = Cookies.get('refreshToken');
      
      if (storedToken && storedRefreshToken) {
        try {
          // Verify token is still valid by making a request
          const response = await api.get('/auth/me');
          setUser(response.data);
          setToken(storedToken);
        } catch {
          // Token is invalid, try to refresh
          try {
            const refreshResponse = await api.post('/auth/refresh', {
              refreshToken: storedRefreshToken,
            });
            
            const { token: newToken, refreshToken: newRefreshToken, user: userData } = refreshResponse.data;
            
            Cookies.set('token', newToken, { expires: 1 });
            Cookies.set('refreshToken', newRefreshToken, { expires: 30 });
            
            setUser(userData);
            setToken(newToken);
        } catch {
          // Both token and refresh failed, clear everything
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

  const login = async (credentials: LoginInput) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user: userData, token: authToken, refreshToken } = response.data as AuthResponse;
      
      // Store tokens in cookies
      Cookies.set('token', authToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything regardless of API call success
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      setUser(null);
      setToken(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = Cookies.get('refreshToken');
      if (!refreshTokenValue) throw new Error('No refresh token');

      const response = await api.post('/auth/refresh', {
        refreshToken: refreshTokenValue,
      });

      const { token: newToken, refreshToken: newRefreshToken, user: userData } = response.data;
      
      Cookies.set('token', newToken, { expires: 1 });
      Cookies.set('refreshToken', newRefreshToken, { expires: 30 });
      
      setUser(userData);
      setToken(newToken);
    } catch (error) {
      // Refresh failed, logout user
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
