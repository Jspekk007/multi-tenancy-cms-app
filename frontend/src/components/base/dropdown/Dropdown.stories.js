import { useState } from 'react';
import { Dropdown } from './Dropdown';
const meta = {
    title: 'UI/BaseDropdown',
    component: Dropdown,
    tags: ['autodocs'],
};
export default meta;
// Example options
const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
];
export const Default = {
    render: () => {
        const [selected, setSelected] = useState(null);
        return (<div style={{ width: 240, padding: 40 }}>
        <Dropdown options={options} selected={selected} onSelect={setSelected} placeholder="Select an option"/>
      </div>);
    },
};
export const Preselected = {
    render: () => {
        const [selected, setSelected] = useState({ label: 'Option B', value: 'b' });
        return (<div style={{ width: 240, padding: 40 }}>
        <Dropdown options={options} selected={selected} onSelect={setSelected}/>
      </div>);
    },
};
export const Disabled = {
    render: () => (<div style={{ width: 240, padding: 40 }}>
      <Dropdown options={options} selected={null} disabled placeholder="Disabled dropdown"/>
    </div>),
};
//# sourceMappingURL=Dropdown.stories.js.map