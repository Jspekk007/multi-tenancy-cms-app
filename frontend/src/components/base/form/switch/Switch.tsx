import './Switch.scss';

import React, { forwardRef } from 'react';

import { FormLabel } from '../shared/form-label/FormLabel';
import type { SwitchProps } from './Switch.types';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ onChange, checked, name, disabled, label }, ref): React.ReactElement => {
    return (
      <FormLabel>
        <span>{label}</span>
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
      </FormLabel>
    );
  },
);
