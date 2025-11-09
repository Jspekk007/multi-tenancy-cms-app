import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/Form/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter your password',
  },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    id: 'password',
    placeholder: 'Your password',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <label htmlFor="password" style={{ display: 'block', marginBottom: '4px' }}>
        Password
      </label>
      <PasswordInput {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'secret',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    value: 'invalid',
  },
};
