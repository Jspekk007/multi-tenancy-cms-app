export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  showPasswordToggle?: boolean;
  size?: 'small' | 'medium' | 'large';
  error?: string;
}
