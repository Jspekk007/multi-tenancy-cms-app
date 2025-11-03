import type { Meta, StoryObj } from '@storybook/react';
import { BaseIcon } from './BaseIcon';
import type { IconName } from './BaseIcons.types';

const meta: Meta<typeof BaseIcon> = {
  title: 'UI/BaseIcon',
  component: BaseIcon,
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
        'check',
        'close',
        'delete',
        'edit',
        'search',
        'settings',
        'user',
      ] satisfies IconName[],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
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

type Story = StoryObj<typeof BaseIcon>;

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
// All variants showcase
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {['primary', 'secondary', 'success', 'warning', 'danger'].map((v) => (
        <BaseIcon key={v} {...args} variant={v as any} />
      ))}
    </div>
  ),
  args: {
    icon: 'check',
    title: 'Check icon',
    ariaLabel: 'Check icon',
  },
};
