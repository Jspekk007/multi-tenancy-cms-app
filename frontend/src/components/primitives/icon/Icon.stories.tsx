import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from './Icon';
import type { IconName } from './Icon.types';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    icon: {
      control: 'select',
      options: [
        'add',
        'alert',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'media',
        'check',
        'close',
        'delete',
        'edit',
        'search',
        'settings',
        'user',
        'dashboard',
        'content',
        'users',
      ] satisfies IconName[],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'white'],
    },
    rotate: {
      control: { type: 'number', min: 0, max: 360, step: 15 },
    },
    className: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    ariaLabel: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

// ------------------------------
// Default icon
export const Default: Story = {
  args: {
    icon: 'add',
    variant: 'primary',
    title: 'Add icon',
    ariaLabel: 'Add icon',
  },
};

// ------------------------------
// Rotated icon
export const Rotated: Story = {
  args: {
    icon: 'arrow-right',
    rotate: 90,
    variant: 'primary',
    title: 'Arrow right rotated',
    ariaLabel: 'Arrow right rotated',
  },
};

// ------------------------------
// Custom class / size example
export const WithCustomClass: Story = {
  args: {
    icon: 'search',
    className: 'text-red-500 w-8 h-8', // Tailwind example or your SCSS class
    variant: 'secondary',
    title: 'Search icon',
    ariaLabel: 'Search icon',
  },
};

// ------------------------------
// All icons showcase
export const AllIcons: Story = {
  render: (args: any) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {[
        'add',
        'alert',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'check',
        'close',
        'delete',
        'edit',
        'search',
        'settings',
        'user',
        'dashboard',
        'content',
        'users',
      ].map((iconName) => (
        <Icon key={iconName} {...args} icon={iconName as IconName} />
      ))}
    </div>
  ),
  args: {
    variant: 'primary',
    title: 'Icon showcase',
    ariaLabel: 'Icon showcase',
  },
};

// ------------------------------
// All variants showcase
export const AllVariants: Story = {
  render: (args: any) => (
    <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#111', padding: '1rem' }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'white'].map((v) => (
        <Icon key={v} {...args} variant={v as any} />
      ))}
    </div>
  ),
  args: {
    icon: 'check',
    title: 'Check icon',
    ariaLabel: 'Check icon',
  },
};
