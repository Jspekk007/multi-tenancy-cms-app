export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  name: string;
  value: string | null;
  options: SelectOption[];
  onChange?: (option: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
