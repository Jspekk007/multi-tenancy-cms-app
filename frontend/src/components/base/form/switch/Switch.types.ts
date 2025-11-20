export interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  error?: string;
}
