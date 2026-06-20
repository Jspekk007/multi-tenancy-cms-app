import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'UI/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  args: {
    icon: 'dashboard',
    label: 'Dashboard',
  },
};
export default meta;

type Story = StoryObj<typeof ListItem>;

export const Default: Story = {};

export const WithLink: Story = {
  args: {
    href: '/dashboard',
  },
};

export const WithoutLink: Story = {
  args: {
    href: undefined,
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
  },
};
