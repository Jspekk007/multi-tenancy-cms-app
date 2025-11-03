import './BaseButton.scss';

import clsx from 'clsx';
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { BaseIcon } from '../icon/BaseIcon';
import { ButtonProps } from './BaseButton.types';

export const BaseButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  iconOnly = false,
  iconLeft,
  iconRight,
  icon,
  iconVariant,
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
    props.className,
  );

  // automatically render icon if 'icon' prop is provided
  const leftIconNode =
    iconLeft ?? (icon ? <BaseIcon icon={icon} variant={iconVariant || variant} /> : null);
  const rightIconNode = iconRight;

  const content = (
    <span className="base-button-content">
      {leftIconNode}
      {children}
      {rightIconNode}
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
