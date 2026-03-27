export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  showPasswordToggle?: boolean;
  showPasswordStrength?: boolean;
  size?: 'small' | 'medium' | 'large';
  error?: string;
}
