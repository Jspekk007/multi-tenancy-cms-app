import { Dropdown } from '@/components/primitives/dropdown/Dropdown';
import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import { Icon } from '@/components/primitives/icon/Icon';

interface AppHeaderTenantSelectorProps {
  siteOptions: DropdownOption[];
  selectedSite: DropdownOption | null;
  disabled?: boolean;
  onSiteSelect: (option: DropdownOption) => void;
}

export const AppHeaderTenantSelector: React.FC<AppHeaderTenantSelectorProps> = ({
  siteOptions,
  selectedSite,
  disabled = false,
  onSiteSelect,
}) => {
  return (
    <Dropdown
      options={siteOptions}
      selected={selectedSite}
      onSelect={onSiteSelect}
      disabled={disabled}
      triggerAriaLabel="Select site"
      triggerClassName="app-header__tenant-trigger"
      triggerContent={
        <span className="app-header__tenant-content">
          <Icon icon="tenant" aria-hidden="true" />
          <span className="app-header__tenant-label">Site:</span>
          <strong className="app-header__tenant-name">{selectedSite?.label ?? 'Loading...'}</strong>
          <Icon icon="arrow-down" className="app-header__tenant-chevron" aria-hidden="true" />
        </span>
      }
    />
  );
};
