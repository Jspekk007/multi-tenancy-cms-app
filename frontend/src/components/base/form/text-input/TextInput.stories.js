import { useState } from 'react';
import { TextInput } from './TextInput';
const meta = {
    title: 'UI/Form/TextInput',
    component: TextInput,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => {
        const [value, setValue] = useState('');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput placeholder="Enter text" value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>);
    },
};
export const Password = {
    render: () => {
        const [value, setValue] = useState('');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>);
    },
};
export const Prefilled = {
    render: () => {
        const [value, setValue] = useState('Hello World');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput placeholder="Prefilled text" value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>);
    },
};
export const Disabled = {
    render: () => (<div style={{ width: 400, padding: 40 }}>
      <TextInput placeholder="Disabled input" value="Can't edit" disabled/>
    </div>),
};
export const PasswordPrefilled = {
    render: () => {
        const [value, setValue] = useState('secret123');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>);
    },
};
export const WithLabel = {
    render: () => {
        const [value, setValue] = useState('');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput label="Username" placeholder="Enter your username" value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>);
    },
};
//# sourceMappingURL=TextInput.stories.js.map