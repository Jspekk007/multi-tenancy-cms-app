import './Switch.scss';
import React, { forwardRef } from 'react';
export const Switch = forwardRef(({ onChange, checked, name, disabled }, ref) => {
    return (<button ref={ref} type="button" role="switch" aria-checked={checked} aria-disabled={disabled || undefined} name={name} className={`switch ${checked ? 'switch--checked' : ''} ${disabled ? 'switch--disabled' : ''}`} disabled={disabled} onClick={() => !disabled && onChange(!checked)}>
        <span className="switch__thumb"/>
      </button>);
});
//# sourceMappingURL=Switch.js.map