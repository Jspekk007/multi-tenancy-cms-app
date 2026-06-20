'use client';

import './AppHeader.scss';

import { useRouter } from 'next/navigation';

import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { useAuth } from '@/hooks/useAuth';

import type { AppHeaderViewProps } from './AppHeader.types';
import { AppHeaderActions } from './components/AppHeaderActions';
import { AppHeaderSearch } from './components/AppHeaderSearch';
import { AppHeaderTenantSelector } from './components/AppHeaderTenantSelector';
import { mapTenantToDropdownOption } from './utils/AppHeader.utils';

export const AppHeaderView: React.FC<AppHeaderViewProps> = ({
  userEmail,
  tenantOptions,
  selectedTenant,
  isTenantSelectorDisabled,
  onTenantSelect,
  onAvatarMenuSelect,
}) => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__left">
          <AppHeaderTenantSelector
            tenantOptions={tenantOptions}
            selectedTenant={selectedTenant}
            disabled={isTenantSelectorDisabled}
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
  const {
    user,
    tenants,
    activeTenant,
    logout,
    switchTenant,
    isLoadingTenants,
    isSwitchingTenant,
  } = useAuth();

  const tenantOptions = tenants.map((tenant) => mapTenantToDropdownOption(tenant));
  const selectedTenant = activeTenant ? mapTenantToDropdownOption(activeTenant) : null;

  const handleTenantSelect = (option: DropdownOption): void => {
    void switchTenant(option.value);
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
      tenantOptions={tenantOptions}
      selectedTenant={selectedTenant}
      isTenantSelectorDisabled={
        isLoadingTenants || isSwitchingTenant || tenantOptions.length <= 1
      }
      onTenantSelect={handleTenantSelect}
      onAvatarMenuSelect={handleMenuSelect}
    />
  );
};
