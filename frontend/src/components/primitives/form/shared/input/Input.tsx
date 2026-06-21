import './Input.scss';

import { forwardRef } from 'react';

import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      prefix = null,
      suffix = null,
      disabled,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const variantClass = variant !== 'default' ? `input-${variant}` : '';
    const sizeClass = `input-${size}`;
    const disabledClass = disabled ? 'is-disabled' : '';

    return (
      <div
        className={`input-wrapper ${sizeClass} ${variantClass} ${disabledClass}`.trim()}
        aria-disabled={disabled || undefined}
      >
        {prefix && <span className="input-icon prefix">{prefix}</span>}

        <input
          ref={ref}
          disabled={disabled}
          className={`input ${className}`.trim()}
          aria-invalid={variant === 'error' ? 'true' : undefined}
          {...rest}
        />

        {suffix && <span className="input-icon suffix">{suffix}</span>}
      </div>
    );
  },
);
