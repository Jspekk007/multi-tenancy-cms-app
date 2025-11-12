import './TextInput.scss';

import { forwardRef, useState } from 'react';

import { BaseInput } from '@/components/base/form/shared/base-input/BaseInput';
import { BaseIcon } from '@/components/base/icon/BaseIcon';

import { FormLabel } from '../shared/form-label/FormLabel';
import { TextInputProps } from './TextInput.types';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = 'text', showPasswordToggle = false, label, id, name, value, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';

    const handleToggle = (): void => setVisible((prev) => !prev);

    return (
      <div className="text-input">
        {label && (
          <FormLabel htmlFor={id || name} className="text-input__label">
            {label}
          </FormLabel>
        )}

        <BaseInput
          {...props}
          ref={ref} // forward the ref to the actual input
          id={id || name}
          name={name}
          value={value}
          type={isPassword && showPasswordToggle ? (visible ? 'text' : 'password') : type}
          suffix={
            isPassword && showPasswordToggle ? (
              <BaseIcon
                icon={visible ? 'eye-off' : 'eye'}
                ariaLabel="Toggle password visibility"
                variant="secondary"
                onClick={handleToggle}
                className="password-toggle"
              />
            ) : undefined
          }
        />
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
