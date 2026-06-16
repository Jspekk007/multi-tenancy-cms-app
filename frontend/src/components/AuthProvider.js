'use client';
import { AuthProvider as AuthProviderComponent } from '@/hooks/useAuth';
export function AuthProvider({ children }) {
    return <AuthProviderComponent>{children}</AuthProviderComponent>;
}
//# sourceMappingURL=AuthProvider.js.map