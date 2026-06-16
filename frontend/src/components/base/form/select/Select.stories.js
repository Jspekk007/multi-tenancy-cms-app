import { useState } from 'react';
import { Select } from './Select';
const meta = {
    title: 'UI/Form/Select',
    component: Select,
    tags: ['autodocs'],
};
export default meta;
const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Orange', value: 'orange' },
    { label: 'Banana', value: 'banana' },
];
export const Default = {
    render: () => {
        const [selected, setSelected] = useState(null);
        return (<div style={{ width: 240, padding: 40 }}>
        <Select label="default" name="default" options={options} value={selected} onChange={setSelected}/>
      </div>);
    },
};
export const Preselected = {
    render: () => {
        const [selected, setSelected] = useState('orange');
        return (<div style={{ width: 240, padding: 40 }}>
        <Select label="preselected" name="preselected" options={options} value={selected} onChange={setSelected}/>
      </div>);
    },
};
export const Disabled = {
    render: () => (<div style={{ width: 240, padding: 40 }}>
      <Select label="disabled" name="disabled" options={options} value={null} disabled/>
    </div>),
};
//# sourceMappingURL=Select.stories.js.map