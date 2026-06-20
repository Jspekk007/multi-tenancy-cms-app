import './Switch.scss';

import React, { forwardRef } from 'react';

import type { SwitchProps } from './Switch.types';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ onChange, checked, name, disabled }, ref): React.ReactNode => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        name={name}
        className={`switch ${checked ? 'switch--checked' : ''} ${disabled ? 'switch--disabled' : ''}`}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="switch__thumb" />
      </button>
    );
  },
);
