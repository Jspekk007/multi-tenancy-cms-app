import './BaseButton.scss';

import clsx from 'clsx';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
type Size = 'medium' | 'small' | 'large' | 'icon';

interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  href?: string;
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  iconOnly = false,
  iconLeft,
  iconRight,
  href,
  children,
  ariaLabel,
  ...props
}) => {
  const isLink = Boolean(href);

  const className = clsx(
    'base-button',
    variant,
    size,
    {
      'icon-only': iconOnly,
      loading,
      disabled,
    },
    props.className
  );

  const content = (
    <span className="base-button-content">
      {iconLeft}
      {children}
      {iconRight}
    </span>
  );

  const loader = loading ? <span className="loader" aria-hidden="true" /> : null;

  if (isLink) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        className={className}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
        {loader}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={className}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
      {loader}
    </button>
  );
};
