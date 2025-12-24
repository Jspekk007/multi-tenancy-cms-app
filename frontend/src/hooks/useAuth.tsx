'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { trpc } from 'trpc/trpc';

import { AuthContextType, LoginInput } from '@/types/auth';
import { RegisterInput } from '@/utils/validators';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const utils = trpc.useUtils();

  // Query for current user
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = trpc.auth.me.useQuery(undefined, {
    enabled: !!Cookies.get('token'),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      const { user: userData, token: authToken, refreshToken } = data;
      Cookies.set('token', authToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      setToken(authToken);
      utils.auth.me.setData(undefined, userData);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      const { user: userData, token: authToken, refreshToken } = data;
      Cookies.set('token', authToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      setToken(authToken);
      utils.auth.me.setData(undefined, userData);
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      handleLogout();
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      handleLogout();
    },
  });

  const refreshMutation = trpc.auth.refresh.useMutation({
    onSuccess: (data) => {
      const { user: userData, token: authToken, refreshToken } = data;
      Cookies.set('token', authToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      setToken(authToken);
      utils.auth.me.setData(undefined, userData);
    },
    onError: () => {
      handleLogout();
    },
  });

  const handleLogout = (): void => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setToken(null);
    utils.auth.me.reset();
    router.push('/auth/login');
  };

  const login = async (credentials: LoginInput): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (registrationData: RegisterInput): Promise<void> => {
    await registerMutation.mutateAsync(registrationData);
  };

  const logout = async (): Promise<void> => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      await logoutMutation.mutateAsync({ refreshToken });
    } else {
      handleLogout();
    }
  };

  const refreshToken = async (): Promise<void> => {
    const refreshTokenValue = Cookies.get('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token');
    }
    await refreshMutation.mutateAsync({ refreshToken: refreshTokenValue });
  };

  // Initialize token from cookies on mount
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle auth errors - try refresh token
  useEffect(() => {
    if (userError) {
      const refreshTokenValue = Cookies.get('refreshToken');
      if (refreshTokenValue && !refreshMutation.isPending) {
        refreshMutation.mutate({ refreshToken: refreshTokenValue });
      } else if (!refreshTokenValue) {
        handleLogout();
      }
    }
  }, [userError]);

  const isLoading = isLoadingUser || loginMutation.isPending || registerMutation.isPending;

  const value: AuthContextType = {
    user: (user as AuthContextType['user']) || null,
    token,
    isLoading,
    login,
    register,
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
