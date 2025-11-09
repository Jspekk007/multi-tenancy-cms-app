import { FormLabelProps } from './FormLabel.types';

export const FormLabel: React.FC<FormLabelProps> = ({ required = false, children, ...props }) => {
  return (
    <label {...props} className={`form-label ${props.className || ''}`}>
      {children}
      {required && (
        <span aria-hidden="true" className="form-label-required">
          *
        </span>
      )}
    </label>
  );
};
