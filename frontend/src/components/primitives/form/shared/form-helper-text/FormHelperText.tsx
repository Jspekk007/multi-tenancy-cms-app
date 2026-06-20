import './FormHelperText.scss';

import { FormHelperTextProps } from './FormHelperText.types';

export const FormHelperText: React.FC<FormHelperTextProps> = ({ id, children, ...props }) => {
  return (
    <div id={id} className={`form-helper-text ${props.className || ''}`} {...props}>
      {children}
    </div>
  );
};
