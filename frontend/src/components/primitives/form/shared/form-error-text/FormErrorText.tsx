import './FormErrorText.scss';

import React from 'react';

import { FormErrorTextProps } from './FormErrorText.types';

export const FormErrorText: React.FC<FormErrorTextProps> = ({ id, icon, children, ...props }) => {
  return (
    <p id={id} className={`form-error-text ${props.className || ''}`} {...props}>
      {icon && <span className="form-error-text-icon">{icon}</span>}
      {children}
    </p>
  );
};
