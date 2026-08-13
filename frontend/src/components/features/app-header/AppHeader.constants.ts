import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

export const defaultSiteOption: DropdownOption = {
  label: 'Marketing Site',
  value: 'marketing',
};

export const siteOptions: DropdownOption[] = [
  defaultSiteOption,
  { label: 'Docs Portal', value: 'docs' },
  { label: 'Careers Site', value: 'careers' },
];

export const avatarMenuOptions: DropdownOption[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];
