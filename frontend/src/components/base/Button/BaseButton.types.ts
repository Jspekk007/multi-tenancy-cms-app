import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'link' | 'outline';
type Size = 'small' | 'medium' | 'large';

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
  onClick?: () => void;
}

export type ButtonAsButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonAsAnchorProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>;
export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;
