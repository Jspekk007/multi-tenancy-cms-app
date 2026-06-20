import { DropdownOption } from '../dropdown/Dropdown.types';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  className?: string;
  menuEnabled?: boolean;
  menuOptions?: DropdownOption[];
  onMenuSelect?: (option: DropdownOption) => void;
}
