export interface BaseInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  variant?: Variant;
  size?: Size;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
}

type Variant = 'default' | 'error' | 'success';
type Size = 'small' | 'medium' | 'large';
