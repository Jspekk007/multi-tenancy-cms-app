'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '../trpc/trpc';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const utils = trpc.useUtils();
    const { data: user, isLoading: isLoadingUser, error: userError, } = trpc.auth.me.useQuery(undefined, {
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
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        setToken(null);
        utils.auth.me.reset();
        router.push('/login');
    };
    const login = async (credentials) => {
        await loginMutation.mutateAsync(credentials);
    };
    const register = async (registrationData) => {
        await registerMutation.mutateAsync(registrationData);
    };
    const logout = async () => {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            await logoutMutation.mutateAsync({ refreshToken });
        }
        else {
            handleLogout();
        }
    };
    const requestPasswordReset = async (email) => {
        return await passwordResetMutation.mutateAsync({ email });
    };
    const refreshToken = async () => {
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
            }
            else if (!refreshTokenValue) {
                handleLogout();
            }
        }
    }, [userError]);
    const isLoading = isLoadingUser || loginMutation.isPending || registerMutation.isPending;
    const value = {
        user: user || null,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        requestPasswordReset,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=useAuth.js.map