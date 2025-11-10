import './Select.scss';

import { useState } from 'react';

import { Dropdown } from '../../dropdown/Dropdown';
import { DropdownOption } from '../../dropdown/Dropdown.types';
import { SelectProps } from './Select.types';

/**
 * Controlled Select built on top of a reusable Dropdown.
 * Basic keyboard navigation included (ArrowUp/Down, Enter, Escape).
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value = null,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}) => {
  const [selected, setSelected] = useState<DropdownOption | null>(value);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    if (onChange) onChange(option);
  };

  return (
    <div className="select">
      <Dropdown
        options={options}
        selected={selected}
        onSelect={handleSelect}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
