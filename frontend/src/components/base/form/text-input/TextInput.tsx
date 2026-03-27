import './TextInput.scss';

import { forwardRef, useState } from 'react';
import { useEffect } from 'react';

import { BaseInput } from '@/components/base/form/shared/base-input/BaseInput';
import { BaseIcon } from '@/components/base/icon/BaseIcon';

import { PasswordStrength } from '../password-strength/PasswordStrength';
import { FormLabel } from '../shared/form-label/FormLabel';
import { TextInputProps } from './TextInput.types';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      type = 'text',
      showPasswordToggle = false,
      showPasswordStrength,
      label,
      id,
      name,
      value = '',
      error,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const isPassword = type === 'password';

    useEffect(() => {
      setIsClient(true);
    }, []);

    const handleToggle = (): void => setVisible((prev) => !prev);

    const inputType =
      isPassword && showPasswordToggle && isClient ? (visible ? 'text' : 'password') : type;

    const suffix =
      isPassword && showPasswordToggle && isClient ? (
        <BaseIcon
          icon={visible ? 'eye-off' : 'eye'}
          ariaLabel="Toggle password visibility"
          variant="secondary"
          onClick={handleToggle}
          className="password-toggle"
        />
      ) : undefined;

    return (
      <div className="text-input">
        {label && (
          <FormLabel htmlFor={id || name} className="text-input__label">
            {label}
            {props.required && <span className="text-input__label__required">*</span>}
          </FormLabel>
        )}

        <BaseInput
          {...props}
          ref={ref} // forward the ref to the actual input
          id={id || name}
          name={name}
          value={value}
          type={inputType}
          variant={error ? 'error' : 'default'}
          suffix={suffix}
        />
        {error && (
          <p
            className="text-input__error"
            style={{ color: 'red', marginTop: '4px', fontSize: '12px' }}
          >
            {error}
          </p>
        )}

        {isPassword && showPasswordStrength && <PasswordStrength password={String(value)} />}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
