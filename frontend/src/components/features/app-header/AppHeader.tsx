'use client';

import './AppHeader.scss';

import { useRouter } from 'next/navigation';

import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { useAuth } from '@/hooks/useAuth';

import type { AppHeaderViewProps } from './AppHeader.types';
import { AppHeaderActions } from './components/AppHeaderActions';
import { AppHeaderSearch } from './components/AppHeaderSearch';
import { AppHeaderTenantSelector } from './components/AppHeaderTenantSelector';
import { mapSiteToDropdownOption } from './utils/AppHeader.utils';

export const AppHeaderView: React.FC<AppHeaderViewProps> = ({
  userEmail,
  siteOptions,
  selectedSite,
  isSiteSelectorDisabled,
  onSiteSelect,
  onAvatarMenuSelect,
}) => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__left">
          <AppHeaderTenantSelector
            siteOptions={siteOptions}
            selectedSite={selectedSite}
            disabled={isSiteSelectorDisabled}
            onSiteSelect={onSiteSelect}
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
  const { user, sites, activeSite, logout, selectSite, isLoadingSites } = useAuth();

  const siteOptions = sites.map((site) => mapSiteToDropdownOption(site));
  const selectedSite = activeSite ? mapSiteToDropdownOption(activeSite) : null;

  const handleSiteSelect = (option: DropdownOption): void => {
    selectSite(option.value);
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
      siteOptions={siteOptions}
      selectedSite={selectedSite}
      isSiteSelectorDisabled={isLoadingSites || siteOptions.length <= 1}
      onSiteSelect={handleSiteSelect}
      onAvatarMenuSelect={handleMenuSelect}
    />
  );
};
