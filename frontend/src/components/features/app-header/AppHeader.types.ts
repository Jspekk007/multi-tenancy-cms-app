import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

export interface AppHeaderViewProps {
  userEmail?: string;
  tenantOptions: DropdownOption[];
  selectedTenant: DropdownOption | null;
  isTenantSelectorDisabled?: boolean;
  onTenantSelect: (option: DropdownOption) => void;
  onAvatarMenuSelect: (option: DropdownOption) => void;
}
