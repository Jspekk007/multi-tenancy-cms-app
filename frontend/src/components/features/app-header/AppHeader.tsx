'use client';

import './AppHeader.scss';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '@/components/primitives/avatar/Avatar';
import { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { Logo } from '@/components/primitives/logo/Logo';
import { useAuth } from '@/hooks/useAuth';

const avatarMenuOptions: DropdownOption[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];

const toTitleCase = (value: string): string => {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getCurrentPageLabel = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return 'Dashboard';
  }

  const current = segments[segments.length - 1];
  return toTitleCase(current);
};

const getAvatarInitials = (email?: string): string => {
  if (!email) return 'U';

  const [localPart] = email.split('@');
  return localPart.slice(0, 2).toUpperCase();
};

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const currentLabel = getCurrentPageLabel(pathname);

  const handleMenuSelect = async (option: DropdownOption): Promise<void> => {
    if (option.value === 'logout') {
      await logout();
      return;
    }

    if (option.value === 'profile') {
      router.push('/dashboard');
      return;
    }

    if (option.value === 'settings') {
      router.push('/dashboard');
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link href="/dashboard" className="app-header__brand" aria-label="Go to dashboard">
          <Logo assetType="wordmark" size="header" />
        </Link>

        <div className="app-header__search">
          <input type="search" placeholder="Search content..." aria-label="Search content" />
        </div>

        <div className="app-header__right">
          <span className="app-header__breadcrumb">{currentLabel}</span>
          <Avatar
            initials={getAvatarInitials(user?.email)}
            alt="Open profile menu"
            menuEnabled
            menuOptions={avatarMenuOptions}
            onMenuSelect={handleMenuSelect}
          />
        </div>
      </div>
    </header>
  );
};
