import './Avatar.scss';
import type { Meta, StoryObj, StoryContext } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Avatar } from './Avatar';
import { AvatarProps } from './Avatar.types';

const meta: Meta<AvatarProps> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs', 'test'],
  args: {
    alt: 'Avatar',
    menuEnabled: true,
  },
};

export default meta;
type Story = StoryObj<AvatarProps>;

export const Default: Story = {
  args: {
    alt: 'Default Avatar',
    menuEnabled: true,
    initials: 'D.A',
  },
  play: async ({ canvasElement }: StoryContext<AvatarProps>) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: /default avatar/i });

    await expect(avatar).toBeInTheDocument();
    await userEvent.click(avatar);

    const menuOption = canvas.getByText('Profile');
    await expect(menuOption).toBeInTheDocument();
    await userEvent.click(menuOption);
  },
};

export const WithImage: Story = {
  args: {
    alt: 'Avatar with Image',
    menuEnabled: true,
    src: 'https://picsum.photos/seed/avatar/64/64',
  },
  play: async ({ canvasElement }: StoryContext<AvatarProps>) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: /avatar with image/i });

    await expect(avatar).toBeInTheDocument();
    await userEvent.click(avatar);

    const menuOption = canvas.getByText('Settings');
    await expect(menuOption).toBeInTheDocument();
    await userEvent.click(menuOption);
  },
};

export const NoMenu: Story = {
  args: {
    src: 'https://picsum.photos/seed/base/64/64',
    alt: 'Avatar without Menu',
    menuEnabled: false,
    initials: 'N.M',
  },
  play: async ({ canvasElement }: StoryContext<AvatarProps>) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('img', { name: /avatar without menu/i });

    await expect(avatar).toBeInTheDocument();
    await userEvent.click(avatar);

    const menuOption = canvas.queryByText('Logout');
    await expect(menuOption).not.toBeInTheDocument();
  },
};

export const CustomMenuOptions: Story = {
  args: {
    alt: 'Avatar with Custom Menu',
    menuEnabled: true,
    initials: 'C.M',
    menuOptions: [
      { label: 'Dashboard', value: 'dashboard' },
      { label: 'Account', value: 'account' },
      { label: 'Sign Out', value: 'signout' },
    ],
  },
  play: async ({ canvasElement }: StoryContext<AvatarProps>) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: /avatar with custom menu/i });

    await expect(avatar).toBeInTheDocument();
    await userEvent.click(avatar);

    const menuOption = canvas.getByText('Account');
    await expect(menuOption).toBeInTheDocument();
    await userEvent.click(menuOption);
  },
};
