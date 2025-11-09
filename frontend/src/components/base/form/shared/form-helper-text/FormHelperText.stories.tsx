import { Meta, StoryObj } from '@storybook/react';
import { FormHelperText } from './FormHelperText';

const meta: Meta<typeof FormHelperText> = {
  title: 'UI/Form/FormHelperText',
  component: FormHelperText,
};

export default meta;
type Story = StoryObj<typeof FormHelperText>;

export const Default: Story = {
  args: {
    children: 'This is helper text.',
  },
};

export const LongText: Story = {
  args: {
    children: 'You can provide more detailed guidance here for the user about input requirements.',
  },
};
