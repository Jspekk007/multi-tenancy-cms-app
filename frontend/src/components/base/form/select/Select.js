import './Select.scss';
import React from 'react';
import { Dropdown } from '../../dropdown/Dropdown';
import { FormLabel } from '../shared/form-label/FormLabel';
/**
 * Controlled Select built on top of a reusable Dropdown.
 * Works with RHF primitives (string | null) as value.
 */
export const Select = ({ options, label, value = null, // string | null
onChange, placeholder = 'Select...', disabled = false, }) => {
    // Map primitive value to the DropdownOption
    const selectedOption = options.find((opt) => opt.value === value) || null;
    const handleSelect = (option) => {
        if (onChange)
            onChange(option.value); // pass primitive back to RHF
    };
    return (<div className={`select ${disabled ? 'select--disabled' : ''}`}>
      {label && <FormLabel required>{label}</FormLabel>}
      <Dropdown options={options} selected={selectedOption} onSelect={handleSelect} placeholder={placeholder} disabled={disabled}/>
    </div>);
};
//# sourceMappingURL=Select.js.map