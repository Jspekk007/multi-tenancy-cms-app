'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar } from '@/components/base/avatar/Avatar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage(): JSX.Element | null {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    setMounted(true);
  }, [user, isLoading, router]);

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Avatar />
      <h4 onClick={handleLogout}>Logout</h4>
    </div>
  );
}
