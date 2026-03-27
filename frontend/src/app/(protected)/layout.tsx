'use client';

import './protected-layout.scss';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppHeader } from '@/components/layout/app-header/AppHeader';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    setMounted(true);
  }, [isLoading, user, router]);

  if (!mounted || isLoading) {
    return (
      <div className="protected-layout__loading">
        <div className="protected-layout__spinner" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="protected-layout">
      <AppHeader />
      <main className="protected-layout__content">{children}</main>
    </div>
  );
}
