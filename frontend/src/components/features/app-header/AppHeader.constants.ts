import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';

export const defaultTenantOption: DropdownOption = {
  label: 'Global Production',
  value: 'global-production',
};

export const tenantOptions: DropdownOption[] = [
  defaultTenantOption,
  { label: 'Global Staging', value: 'global-staging' },
  { label: 'Sandbox', value: 'sandbox' },
];

export const avatarMenuOptions: DropdownOption[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];
