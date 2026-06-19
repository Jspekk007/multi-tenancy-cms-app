import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

export interface AppHeaderViewProps {
  userEmail?: string;
  selectedTenant: DropdownOption;
  onTenantSelect: (option: DropdownOption) => void;
  onAvatarMenuSelect: (option: DropdownOption) => void;
}
