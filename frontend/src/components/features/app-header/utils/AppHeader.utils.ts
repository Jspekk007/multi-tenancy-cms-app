import type { DropdownOption } from '@/components/primitives/dropdown/Dropdown.types';
import type { AuthSiteOption } from '@/types/auth';

export const getAvatarInitials = (email?: string): string => {
  if (!email) return 'U';

  const [localPart] = email.split('@');
  return localPart.slice(0, 2).toUpperCase();
};

export const mapSiteToDropdownOption = (site: AuthSiteOption): DropdownOption => {
  return {
    label: site.name,
    value: site.id,
  };
};
