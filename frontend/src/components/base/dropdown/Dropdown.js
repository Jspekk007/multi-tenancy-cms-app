import './Dropdown.scss';
import React, { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
export const Dropdown = ({ options, placeholder = 'Select…', onSelect, selected = null, disabled = false, triggerContent, triggerClassName = '', triggerAriaLabel, hideChevron = false, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(selected);
    const ref = useRef(null);
    useClickOutside(ref, () => setIsOpen(false));
    const handleSelect = (option) => {
        setCurrent(option);
        onSelect?.(option);
        setIsOpen(false);
    };
    return (<div ref={ref} className={`dropdown ${disabled ? 'dropdown--disabled' : ''} ${triggerContent ? 'dropdown--custom-trigger' : ''}`}>
      <button type="button" className={`dropdown__trigger ${triggerContent ? 'dropdown__trigger--custom' : ''} ${triggerClassName}`} onClick={() => !disabled && setIsOpen(!isOpen)} aria-haspopup="listbox" aria-expanded={isOpen} aria-label={triggerAriaLabel} disabled={disabled}>
        {triggerContent ? (triggerContent) : (<>
            <span>{current?.label ?? placeholder}</span>
            {!hideChevron && (<span className={`dropdown__icon ${isOpen ? 'dropdown__icon--open' : ''}`}>▼</span>)}
          </>)}
      </button>

      {isOpen && (<ul className={`dropdown__menu ${triggerContent ? 'dropdown__menu--custom-trigger' : ''}`} role="listbox">
          {options.map((opt) => (<li key={opt.value} className={`dropdown__option ${current?.value === opt.value ? 'dropdown__option--selected' : ''}`} onClick={() => handleSelect(opt)}>
              {opt.label}
            </li>))}
        </ul>)}
    </div>);
};
//# sourceMappingURL=Dropdown.js.map