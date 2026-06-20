import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Icon } from '@/components/primitives/icon/Icon';

import { FormErrorText } from './FormErrorText';

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
    icon: <Icon icon="alert" />,
  },
};
