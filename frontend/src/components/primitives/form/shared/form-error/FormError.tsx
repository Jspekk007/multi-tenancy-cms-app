import './FormError.scss';

import { FormErrorProps } from './FormError.types';

export const FormError: React.FC<FormErrorProps> = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="form-error" role="alert">
      {message}
    </p>
  );
};
