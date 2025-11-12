import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'UI/Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 400, padding: 40 }}>
        <TextInput
          placeholder="Enter text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 400, padding: 40 }}>
        <TextInput
          type="password"
          showPasswordToggle
          placeholder="Enter password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState('Hello World');
    return (
      <div style={{ width: 400, padding: 40 }}>
        <TextInput
          placeholder="Prefilled text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 400, padding: 40 }}>
      <TextInput placeholder="Disabled input" value="Can't edit" disabled />
    </div>
  ),
};

export const PasswordPrefilled: Story = {
  render: () => {
    const [value, setValue] = useState('secret123');
    return (
      <div style={{ width: 400, padding: 40 }}>
        <TextInput
          type="password"
          showPasswordToggle
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 400, padding: 40 }}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};
