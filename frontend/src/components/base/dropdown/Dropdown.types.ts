export interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect?: (option: DropdownOption) => void;
  selected?: DropdownOption | null;
  disabled?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
}
