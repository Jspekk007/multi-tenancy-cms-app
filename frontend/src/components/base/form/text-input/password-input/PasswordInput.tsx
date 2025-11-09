import './PasswordInput.scss';

import { useState } from 'react';

import { BaseIcon } from '@/components/base/icon/BaseIcon';

import { BaseInput } from '../../shared/base-input/BaseInput';
import type { PasswordInputProps } from './PasswordInput.types';

export const PasswordInput: React.FC<PasswordInputProps> = ({
  toggleAriaLabel = 'Toggle password visibility',
  ...props
}: PasswordInputProps): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const handleToggle = (): void => setVisible((prev) => !prev);

  return (
    <BaseInput
      {...props}
      type={visible ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          aria-label={toggleAriaLabel}
          onClick={handleToggle}
          className="password-toggle"
        >
          <BaseIcon
            icon={visible ? 'eye-off' : 'eye'}
            ariaLabel={toggleAriaLabel}
            variant="secondary"
          />
        </button>
      }
    />
  );
};
