import './BaseIcon.scss';

import { HTMLAttributes } from 'react';

import { type IconName, Icons } from './Icons';

export interface BaseIconProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  title?: string; // optional tooltip / accessibility
  ariaLabel?: string; // screen reader
}

export const BaseIcon = ({
  icon,
  className = '',
  rotate,
  variant = 'primary',
  title,
  ariaLabel,
  ...props
}: BaseIconProps): JSX.Element => {
  const IconComponent = Icons[icon];
  const style = rotate ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <div
      className={`base-icon ${variant} ${className}`}
      style={style}
      role="img"
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      <IconComponent />
    </div>
  );
};
