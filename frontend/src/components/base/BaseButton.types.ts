import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

interface BaseButtonProps {
  variant: Variant;
  size: Size;
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  ariaLabel?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  href?: string;
}

type Variant = 'primary' | 'secondary' | 'danger' | 'link' | 'outline';
type Size = 'small' | 'medium' | 'large';

export type ButtonProps = BaseButtonProps &
  (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);
