import { Switch } from './Switch';
import { useState } from 'react';
const meta = {
    title: 'UI/Form/Switch',
    component: Switch,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return <Switch label="Story" checked={checked} onChange={setChecked}/>;
    },
};
export const checked = {
    render: () => {
        const [checked, setChecked] = useState(true);
        return <Switch label="Story" checked={checked} onChange={setChecked}/>;
    },
};
export const Disabled = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return <Switch label="Story" checked={checked} onChange={setChecked} disabled/>;
    },
};
//# sourceMappingURL=Switch.stories.js.map