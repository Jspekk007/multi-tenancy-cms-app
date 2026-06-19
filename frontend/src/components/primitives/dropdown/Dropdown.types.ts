import { ReactNode } from 'react';

export interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect?: (option: DropdownOption) => void;
  selected?: DropdownOption | null;
  disabled?: boolean;
  triggerContent?: ReactNode;
  triggerClassName?: string;
  triggerAriaLabel?: string;
  hideChevron?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
}
