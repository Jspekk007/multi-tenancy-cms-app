'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import {
  type AuthContextType,
  type AuthResponse,
  isTenantSelectionRequired,
  type LoginInput,
  type LoginResponse,
  type RegisterInput,
  type SwitchTenantResponse,
} from '@/types/auth';

import { trpc } from '../trpc/trpc';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const hasToken = Boolean(token || Cookies.get('token'));

  const persistAuthSession = ({
    user: userData,
    token: authToken,
    refreshToken,
  }: AuthResponse): void => {
    Cookies.set('token', authToken, { expires: 1 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });
    setToken(authToken);

    utils.auth.context.setData(undefined, (currentContext) => ({
      user: userData,
      tenants: currentContext?.tenants ?? [],
    }));
  };

  const persistTenantSwitchSession = ({
    user: userData,
    token: authToken,
  }: SwitchTenantResponse): void => {
    Cookies.set('token', authToken, { expires: 1 });
    setToken(authToken);

    utils.auth.context.setData(undefined, (currentContext) => ({
      user: userData,
      tenants: currentContext?.tenants ?? tenants,
    }));
  };

  const {
    data: authContext,
    isLoading: isLoadingAuthContext,
    error: authContextError,
  } = trpc.auth.context.useQuery(undefined, {
    enabled: hasToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = authContext?.user ?? null;
  const tenants = authContext?.tenants ?? [];

  const activeTenant =
    tenants.find((tenant) => tenant.id === user?.tenantId) ??
    (user
      ? {
          id: user.tenantId,
          name: user.domain,
          domain: user.domain,
          role: user.role,
        }
      : null);

  const handleLogout = useCallback((): void => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setToken(null);
    utils.auth.context.reset();
    router.push('/login');
  }, [router, utils.auth.context]);

  // Mutations
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (isTenantSelectionRequired(data)) {
        return;
      }

      persistAuthSession(data);
      void utils.auth.context.invalidate();
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      persistAuthSession(data);
      void utils.auth.context.invalidate();
    },
  });

  const passwordResetMutation = trpc.auth.passwordReset.useMutation();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      handleLogout();
    },
    onError: () => {
      handleLogout();
    },
  });

  const refreshMutation = trpc.auth.refresh.useMutation({
    onSuccess: (data) => {
      persistAuthSession(data);
      void utils.auth.context.invalidate();
    },
    onError: () => {
      handleLogout();
    },
  });

  const switchTenantMutation = trpc.auth.switchTenant.useMutation({
    onSuccess: (data) => {
      persistTenantSwitchSession(data);
    },
  });

  const login = async (credentials: LoginInput): Promise<LoginResponse> => {
    return await loginMutation.mutateAsync(credentials);
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

  const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
    return await passwordResetMutation.mutateAsync({ email });
  };

  const refreshToken = async (): Promise<void> => {
    const refreshTokenValue = Cookies.get('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token');
    }
    await refreshMutation.mutateAsync({ refreshToken: refreshTokenValue });
  };

  const switchTenant = async (tenantId: string): Promise<void> => {
    if (tenantId === user?.tenantId) {
      return;
    }

    await switchTenantMutation.mutateAsync({ tenantId });
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
    if (authContextError) {
      const refreshTokenValue = Cookies.get('refreshToken');
      if (refreshTokenValue && !refreshMutation.isPending) {
        refreshMutation.mutate({ refreshToken: refreshTokenValue });
      } else if (!refreshTokenValue) {
        handleLogout();
      }
    }
  }, [authContextError, refreshMutation.mutate, refreshMutation.isPending, handleLogout]);

  const isLoading =
    isLoadingAuthContext ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    switchTenantMutation.isPending;

  const value: AuthContextType = {
    user,
    token,
    tenants,
    activeTenant,
    isLoading,
    isLoadingTenants: isLoadingAuthContext,
    isSwitchingTenant: switchTenantMutation.isPending,
    login,
    register,
    logout,
    refreshToken,
    switchTenant,
    requestPasswordReset,
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
