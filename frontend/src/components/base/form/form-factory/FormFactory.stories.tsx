import type { Meta, StoryObj } from '@storybook/react';
import { FormFactory } from './FormFactory';
import type { FormField } from './FormFactory.types';

const meta: Meta<typeof FormFactory> = {
  title: 'UI/Form/FormFactory',
  component: FormFactory,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormFactory>;

// Fields definition
const fields: FormField[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' },
    ],
  },
  {
    name: 'notifications',
    label: 'Enable Notifications',
    type: 'switch',
  },
];

// Default story
export const Default: Story = {
  args: {
    fields,
    onSubmit: (data) => console.log('Form Submitted', data),
  },
};

// With default values story
export const WithDefaultValues: Story = {
  args: {
    fields,
    defaultValues: {
      username: 'john_doe',
      password: '', // optional
      role: 'admin', // matches Select.options.value
      notifications: true, // switch checked
    },
    onSubmit: (data) => console.log('Form Submitted with Default Values', data),
  },
};

export const withResetButton: Story = {
  args: {
    fields,
    resetButton: true,
    onSubmit: (data) => console.log('Form Submitted with Reset Button', data),
  },
};
