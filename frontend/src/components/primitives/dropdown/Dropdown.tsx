import './Dropdown.scss';

import React, { useEffect, useRef, useState } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';

import { DropdownOption, DropdownProps } from './Dropdown.types';

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select…',
  onSelect,
  selected = null,
  disabled = false,
  triggerContent,
  triggerClassName = '',
  triggerAriaLabel,
  hideChevron = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<DropdownOption | null>(selected);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    setCurrent(selected);
  }, [selected]);

  const handleSelect = (option: DropdownOption): void => {
    setCurrent(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      className={`dropdown ${disabled ? 'dropdown--disabled' : ''} ${triggerContent ? 'dropdown--custom-trigger' : ''}`}
    >
      <button
        type="button"
        className={`dropdown__trigger ${triggerContent ? 'dropdown__trigger--custom' : ''} ${triggerClassName}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={triggerAriaLabel}
        disabled={disabled}
      >
        {triggerContent ? (
          triggerContent
        ) : (
          <>
            <span>{current?.label ?? placeholder}</span>
            {!hideChevron && (
              <span className={`dropdown__icon ${isOpen ? 'dropdown__icon--open' : ''}`}>▼</span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <ul
          className={`dropdown__menu ${triggerContent ? 'dropdown__menu--custom-trigger' : ''}`}
          role="listbox"
        >
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
