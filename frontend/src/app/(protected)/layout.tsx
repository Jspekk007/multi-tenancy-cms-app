'use client';

import './protected-layout.scss';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppHeader } from '@/components/features/app-header/AppHeader';
import { Sidebar } from '@/components/features/sidebar/Sidebar';
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
    setMounted(true);

    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const showContentLoader = !mounted || isLoading;

  if (!showContentLoader && !user) {
    return null;
  }

  return (
    <div className="protected-layout grid gap-0">
      <Sidebar />
      <AppHeader />
      <main className="protected-layout__content" aria-busy={showContentLoader}>
        {showContentLoader ? (
          <div className="protected-layout__loading" role="status" aria-label="Loading content">
            <div className="protected-layout__spinner" aria-hidden="true" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
