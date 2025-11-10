import './Dropdown.scss';

import React, { useRef, useState } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';

import { DropdownOption, DropdownProps } from './Dropdown.types';

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select…',
  onSelect,
  selected = null,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<DropdownOption | null>(selected);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const handleSelect = (option: DropdownOption): void => {
    setCurrent(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  if (!open) return null;

  return (
    <div ref={ref} className={`dropdown ${disabled ? 'dropdown--disabled' : ''}`}>
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span>{current?.label ?? placeholder}</span>
        <span className={`dropdown__icon ${isOpen ? 'dropdown__icon--open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="dropdown__menu" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`dropdown__option ${current?.value === opt.value ? 'dropdown__option--selected' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
