import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

export interface AppHeaderViewProps {
  userEmail?: string;
  siteOptions: DropdownOption[];
  selectedSite: DropdownOption | null;
  isSiteSelectorDisabled?: boolean;
  onSiteSelect: (option: DropdownOption) => void;
  onAvatarMenuSelect: (option: DropdownOption) => void;
}
