import React from 'react';
import { FormErrorText } from '../form-error-text/FormErrorText';
import { FormHelperText } from '../form-helper-text/FormHelperText';
import { FormLabel } from '../form-label/FormLabel';
export const FormFieldWrapper = ({ label, required, helperText, errorText, prefixIcon, suffixIcon, children, disabled = false, className = '', }) => {
    const helperId = helperText ? `helper-${Math.random().toString(36).slice(2, 9)}` : undefined;
    const errorId = errorText ? `error-${Math.random().toString(36).slice(2, 9)}` : undefined;
    const ariaDescribedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
    return (<div className={`form-field-wrapper ${className} ${disabled ? 'disabled' : ''}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div className={`input-wrapper ${errorText ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {prefixIcon && <span className="prefix-icon">{prefixIcon}</span>}
        {React.cloneElement(children, {
            'aria-describedby': ariaDescribedBy,
            disabled: disabled || children.props.disabled,
        })}
        {suffixIcon && <span className="suffix-icon">{suffixIcon}</span>}
      </div>
      {helperText && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
      {errorText && <FormErrorText id={errorId}>{errorText}</FormErrorText>}
    </div>);
};
//# sourceMappingURL=FormFieldWrapper.js.map