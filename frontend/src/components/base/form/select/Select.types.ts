export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: SelectOption | null;
  onChange?: (option: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
}
