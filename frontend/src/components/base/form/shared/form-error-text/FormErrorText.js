import './FormErrorText.scss';
import React from 'react';
export const FormErrorText = ({ id, icon, children, ...props }) => {
    return (<p id={id} className={`form-error-text ${props.className || ''}`} {...props}>
      {icon && <span className="form-error-text-icon">{icon}</span>}
      {children}
    </p>);
};
//# sourceMappingURL=FormErrorText.js.map