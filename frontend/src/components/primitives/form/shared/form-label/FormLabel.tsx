import type { FormLabelProps } from './FormLabel.types';

export const FormLabel: React.FC<FormLabelProps> = ({
  required = false,
  children,
  className,
  htmlFor,
  ...props
}) => {
  const labelContent = (
    <>
      {children}
      {required && (
        <span aria-hidden="true" className="form-label-required">
          *
        </span>
      )}
    </>
  );
  const resolvedClassName = `form-label ${className || ''}`;

  if (!htmlFor) {
    return (
      <span {...props} className={resolvedClassName}>
        {labelContent}
      </span>
    );
  }

  return (
    <label {...props} htmlFor={htmlFor} className={resolvedClassName}>
      {labelContent}
    </label>
  );
};
