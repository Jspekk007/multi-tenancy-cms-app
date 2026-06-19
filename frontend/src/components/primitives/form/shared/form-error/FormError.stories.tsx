import './FormError.scss';

import type { Meta, StoryObj } from '@storybook/react';

import { FormError } from './FormError';
import { FormErrorProps } from './FormError.types';

const meta: Meta<FormErrorProps> = {
  title: 'UI/Form/FormError',
  component: FormError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      subtitle: 'Displays an error message for form validation.',
    },
  },
  argTypes: {
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FormErrorProps>;

export const Default: Story = {
  args: {
    message: 'This field is required.',
  },
};
