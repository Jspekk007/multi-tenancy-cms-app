import './Switch.scss';

import type { SwitchProps } from './Switch.types';

export const Switch: React.FC<SwitchProps> = ({ onChange, checked, name, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      name={name}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`switch ${checked ? 'switch--checked' : ''} ${disabled ? 'switch--disabled' : ''}`}
    >
      <span className="switch__thumb" />
    </button>
  );
};
