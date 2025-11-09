import type { Meta, StoryObj } from '@storybook/react';
import { BaseInput } from './BaseInput';

const meta: Meta<typeof BaseInput> = {
  title: 'UI/Form/BaseInput',
  component: BaseInput,
  args: {
    placeholder: 'Enter text...',
    disabled: false,
    size: 'medium',
    variant: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof BaseInput>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: <span>@</span>,
    placeholder: 'username',
  },
};

export const WithSuffix: Story = {
  args: {
    suffix: <span>.com</span>,
    placeholder: 'website',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    placeholder: 'Invalid value',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};
