import './Icon.scss';

import { HTMLAttributes } from 'react';

import { type IconName, Icons } from './Icons';

export interface IconProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'white';
  title?: string; // optional tooltip / accessibility
  ariaLabel?: string; // screen reader
}

export const Icon = ({
  icon,
  className = '',
  rotate,
  variant = 'default',
  title,
  ariaLabel,
  ...props
}: IconProps): JSX.Element => {
  const IconComponent = Icons[icon];
  const style = rotate ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <div
      className={`icon ${variant} ${className}`}
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
