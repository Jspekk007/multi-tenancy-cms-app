import { BaseInputProps } from '../../shared/base-input/BaseInput.types';

export interface PasswordInputProps extends Omit<BaseInputProps, 'type'> {
  toggleAriaLabel?: string;
}
