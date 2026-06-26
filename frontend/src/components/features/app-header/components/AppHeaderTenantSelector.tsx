import { Dropdown } from '@/components/primitives/dropdown/Dropdown';
import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { Icon } from '@/components/primitives/icon/Icon';

interface AppHeaderTenantSelectorProps {
  tenantOptions: DropdownOption[];
  selectedTenant: DropdownOption | null;
  disabled?: boolean;
  onTenantSelect: (option: DropdownOption) => void;
}

export const AppHeaderTenantSelector: React.FC<AppHeaderTenantSelectorProps> = ({
  tenantOptions,
  selectedTenant,
  disabled = false,
  onTenantSelect,
}) => {
  return (
    <Dropdown
      options={tenantOptions}
      selected={selectedTenant}
      onSelect={onTenantSelect}
      disabled={disabled}
      triggerAriaLabel="Select tenant"
      triggerClassName="app-header__tenant-trigger"
      triggerContent={
        <span className="app-header__tenant-content">
          <Icon icon="tenant" aria-hidden="true" />
          <span className="app-header__tenant-label">Tenant:</span>
          <strong className="app-header__tenant-name">
            {selectedTenant?.label ?? 'Loading...'}
          </strong>
          <Icon icon="arrow-down" className="app-header__tenant-chevron" aria-hidden="true" />
        </span>
      }
    />
  );
};
