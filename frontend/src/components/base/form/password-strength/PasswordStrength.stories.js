import { useState } from 'react';
import { PasswordStrength } from './PasswordStrength';
import { TextInput } from '../text-input/TextInput';
const meta = {
    title: 'UI/Form/PasswordStrength',
    component: PasswordStrength,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => {
        const [password, setPassword] = useState('');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <PasswordStrength password={password}/>
      </div>);
    },
};
export const WithoutRequirements = {
    render: () => {
        const [password, setPassword] = useState('');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <PasswordStrength password={password} showRequirements={false}/>
      </div>);
    },
};
export const Prefilled = {
    render: () => {
        const [password, setPassword] = useState('P@ssw0rd123');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <PasswordStrength password={password}/>
      </div>);
    },
};
export const Disabled = {
    render: () => {
        const [password, setPassword] = useState('Disabled1!');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} disabled/>
        <PasswordStrength password={password}/>
      </div>);
    },
};
export const StrongPassword = {
    render: () => {
        const [password, setPassword] = useState('Str0ngP@ssw0rd!');
        return (<div style={{ width: 400, padding: 40 }}>
        <TextInput type="password" showPasswordToggle placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <PasswordStrength password={password}/>
      </div>);
    },
};
//# sourceMappingURL=PasswordStrength.stories.js.map