import { Meta, StoryObj } from '@storybook/react';
import { FormLabel } from './FormLabel';

const meta: Meta<typeof FormLabel> = {
  title: 'UI/Form/Label',
  component: FormLabel,
};

export default meta;
type Story = StoryObj<typeof FormLabel>;

export const Default: Story = {
  args: {
    children: 'Default Label',
    required: false,
  },
};

export const Required: Story = {
  args: {
    children: 'Required Label',
    required: true,
  },
};
