import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter your text',
  },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    id: 'id',
    placeholder: 'Your text',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <label htmlFor="id" style={{ display: 'block', marginBottom: '4px' }}>
        Label
      </label>
      <Sidebar {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'sample',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    value: 'invalid',
  },
};
