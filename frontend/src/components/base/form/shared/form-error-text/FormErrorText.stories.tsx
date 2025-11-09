import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormErrorText } from './FormErrorText';
import { BaseIcon } from '@/components/base/icon/BaseIcon';

const meta: Meta<typeof FormErrorText> = {
  title: 'UI/Form/FormErrorText',
  component: FormErrorText,
};

export default meta;
type Story = StoryObj<typeof FormErrorText>;

export const Default: Story = {
  args: {
    children: 'This field is required.',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Invalid email address.',
    icon: <BaseIcon icon="alert" />,
  },
};
