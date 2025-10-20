'use client';

import { AuthProvider as AuthProviderComponent } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderComponent>
      {children}
    </AuthProviderComponent>
  );
}
