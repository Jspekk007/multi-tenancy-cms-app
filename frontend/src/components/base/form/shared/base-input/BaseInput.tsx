import './BaseInput.scss';

import { forwardRef } from 'react';

import { BaseInputProps } from './BaseInput.types';

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
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
        className={`base-input-wrapper ${sizeClass} ${variantClass} ${disabledClass}`.trim()}
        aria-disabled={disabled || undefined}
      >
        {prefix && <span className="input-icon prefix">{prefix}</span>}

        <input
          ref={ref}
          disabled={disabled}
          className={`base-input ${className}`.trim()}
          aria-invalid={variant === 'error' ? 'true' : undefined}
          {...rest}
        />

        {suffix && <span className="input-icon suffix">{suffix}</span>}
      </div>
    );
  },
);
