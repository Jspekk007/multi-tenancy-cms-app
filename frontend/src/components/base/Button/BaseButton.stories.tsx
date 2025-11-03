import './BaseButton.scss';

import type { Meta, StoryObj } from '@storybook/react';

import { BaseButton } from './BaseButton';
import { ButtonProps } from './BaseButton.types';

const meta: Meta<ButtonProps> = {
  title: 'UI/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      subtitle: 'A flexible and accessible button for all UI actions.',
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'link', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    iconLeft: { control: false },
    iconRight: { control: false },
    href: { control: 'text' },
    ariaLabel: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    iconOnly: false,
    ariaLabel: undefined,
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const IconOnly: Story = {
  args: {
    children: null,
    iconOnly: true,
    icon: 'arrow-right',
    iconVariant: 'primary',
    ariaLabel: 'Fire Button',
  },
};

export const LinkButton: Story = {
  args: {
    children: 'Go to Google',
    href: 'https://google.com',
    variant: 'link',
  },
};
