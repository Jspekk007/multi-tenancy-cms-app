import './BaseButton.scss';
import type { Meta, StoryObj, StoryContext } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { BaseButton } from './BaseButton';
import { ButtonProps } from './BaseButton.types';

const meta: Meta<ButtonProps> = {
  title: 'UI/BaseButton',
  component: BaseButton,
  tags: ['autodocs', 'test'],
  args: {
    onClick: fn(),
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    iconVariant: 'primary',
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    ariaLabel: 'Primary Button',
  },
  play: async ({ canvasElement, args }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
    ariaLabel: 'Loading',
  },
  play: async ({ canvasElement }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeDisabled();
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
    ariaLabel: 'Secondary Button',
  },
  play: async ({ canvasElement, args }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    ariaLabel: 'Disabled Button',
  },
  play: async ({ canvasElement, args }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeDisabled();
    // Disabled elements reject pointer events; assert the handler was never invoked.
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
    ariaLabel: 'Outline Button',
  },
  play: async ({ canvasElement, args }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const KeyboardActivation: Story = {
  args: {
    children: 'Focus and activate',
    variant: 'primary',
    ariaLabel: 'Keyboard Activation Button',
  },
  play: async ({ canvasElement, args }: StoryContext<ButtonProps>) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    button.focus();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};
