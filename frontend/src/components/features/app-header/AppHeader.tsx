'use client';

import './AppHeader.scss';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { useAuth } from '@/hooks/useAuth';

import { defaultTenantOption } from './AppHeader.constants';
import type { AppHeaderViewProps } from './AppHeader.types';
import { AppHeaderActions } from './components/AppHeaderActions';
import { AppHeaderSearch } from './components/AppHeaderSearch';
import { AppHeaderTenantSelector } from './components/AppHeaderTenantSelector';

export const AppHeaderView: React.FC<AppHeaderViewProps> = ({
  userEmail,
  selectedTenant,
  onTenantSelect,
  onAvatarMenuSelect,
}) => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__left">
          <AppHeaderTenantSelector
            selectedTenant={selectedTenant}
            onTenantSelect={onTenantSelect}
          />
          <div className="app-header__divider" aria-hidden="true"></div>
        </div>

        <AppHeaderSearch />

        <AppHeaderActions userEmail={userEmail} onAvatarMenuSelect={onAvatarMenuSelect} />
      </div>
    </header>
  );
};

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<DropdownOption>(defaultTenantOption);

  const handleTenantSelect = (option: DropdownOption): void => {
    setSelectedTenant(option);
  };

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
    <AppHeaderView
      userEmail={user?.email}
      selectedTenant={selectedTenant}
      onTenantSelect={handleTenantSelect}
      onAvatarMenuSelect={handleMenuSelect}
    />
  );
};
