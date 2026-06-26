import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import type { AuthTenantOption } from '@/types/auth';

export const getAvatarInitials = (email?: string): string => {
  if (!email) return 'U';

  const [localPart] = email.split('@');
  return localPart.slice(0, 2).toUpperCase();
};

export const mapTenantToDropdownOption = (tenant: AuthTenantOption): DropdownOption => {
  return {
    label: tenant.name,
    value: tenant.id,
  };
};
