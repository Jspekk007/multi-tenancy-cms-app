'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setAuthCookies,
} from '@/lib/authCookies';
import { redirectToLogin } from '@/lib/tenantUrl';
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
  const [token, setToken] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const hasToken = Boolean(token || getAccessToken());

  const persistAuthSession = ({
    user: userData,
    token: authToken,
    refreshToken,
    sites,
  }: AuthResponse): void => {
    setAuthCookies(authToken, refreshToken);
    setToken(authToken);

    utils.auth.context.setData(undefined, (currentContext) => ({
      user: userData,
      tenants: currentContext?.tenants.length
        ? currentContext.tenants
        : [
            {
              id: userData.tenantId,
              name: userData.tenantName,
              slug: userData.tenantSlug,
              role: userData.role,
            },
          ],
      sites,
    }));
  };

  const persistTenantSwitchSession = ({
    user: userData,
    token: authToken,
    sites,
  }: SwitchTenantResponse): void => {
    setAccessToken(authToken);
    setToken(authToken);

    utils.auth.context.setData(undefined, (currentContext) => ({
      user: userData,
      tenants: currentContext?.tenants ?? tenants,
      sites,
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
  const sites = authContext?.sites ?? [];

  const activeTenant =
    tenants.find((tenant) => tenant.id === user?.tenantId) ??
    (user
      ? {
          id: user.tenantId,
          name: user.tenantName,
          slug: user.tenantSlug,
          role: user.role,
        }
      : null);
  const activeSite = sites.find((site) => site.id === selectedSiteId) ?? sites[0] ?? null;

  const handleLogout = useCallback((): void => {
    clearAuthCookies();
    setToken(null);
    setSelectedSiteId(null);
    utils.auth.context.reset();
    redirectToLogin();
  }, [utils.auth.context]);

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

  const register = async (registrationData: RegisterInput): Promise<AuthResponse> => {
    return await registerMutation.mutateAsync(registrationData);
  };

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
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
    const refreshTokenValue = getRefreshToken();
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

  const selectSite = (siteId: string): void => {
    const site = sites.find((item) => item.id === siteId);
    if (!site || !user) {
      return;
    }

    setSelectedSiteId(site.id);
    window.localStorage.setItem(`atlas:selected-site:${user.tenantId}`, site.id);
  };

  // Initialize token from cookies on mount
  useEffect(() => {
    const storedToken = getAccessToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle auth errors - try refresh token
  useEffect(() => {
    if (authContextError) {
      const refreshTokenValue = getRefreshToken();
      if (refreshTokenValue && !refreshMutation.isPending) {
        refreshMutation.mutate({ refreshToken: refreshTokenValue });
      } else if (!refreshTokenValue) {
        handleLogout();
      }
    }
  }, [authContextError, refreshMutation.mutate, refreshMutation.isPending, handleLogout]);

  useEffect(() => {
    if (!user || !sites.length) {
      setSelectedSiteId(null);
      return;
    }

    const storageKey = `atlas:selected-site:${user.tenantId}`;
    const storedSiteId = window.localStorage.getItem(storageKey);
    const nextSiteId =
      storedSiteId && sites.some((site) => site.id === storedSiteId) ? storedSiteId : sites[0].id;

    setSelectedSiteId(nextSiteId);
    window.localStorage.setItem(storageKey, nextSiteId);
  }, [sites, user]);

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
    sites,
    activeSite,
    isLoading,
    isLoadingTenants: isLoadingAuthContext,
    isLoadingSites: isLoadingAuthContext,
    isSwitchingTenant: switchTenantMutation.isPending,
    login,
    register,
    logout,
    refreshToken,
    switchTenant,
    selectSite,
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
