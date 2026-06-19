import { Dropdown } from '@/components/primitives/dropdown/Dropdown';
import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { Icon } from '@/components/primitives/icon/Icon';

import { tenantOptions } from '../AppHeader.constants';

interface AppHeaderTenantSelectorProps {
  selectedTenant: DropdownOption;
  onTenantSelect: (option: DropdownOption) => void;
}

export const AppHeaderTenantSelector: React.FC<AppHeaderTenantSelectorProps> = ({
  selectedTenant,
  onTenantSelect,
}) => {
  return (
    <Dropdown
      options={tenantOptions}
      selected={selectedTenant}
      onSelect={onTenantSelect}
      triggerAriaLabel="Select tenant"
      triggerClassName="app-header__tenant-trigger"
      triggerContent={
        <span className="app-header__tenant-content">
          <Icon icon="tenant" aria-hidden="true" />
          <span className="app-header__tenant-label">Tenant:</span>
          <strong className="app-header__tenant-name">{selectedTenant.label}</strong>
          <Icon icon="arrow-down" className="app-header__tenant-chevron" aria-hidden="true" />
        </span>
      }
    />
  );
};
