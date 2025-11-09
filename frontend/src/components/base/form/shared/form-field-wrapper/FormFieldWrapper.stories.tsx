import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormFieldWrapper } from './FormFieldWrapper';

const meta: Meta<typeof FormFieldWrapper> = {
  title: 'UI/Form/FormFieldWrapper',
  component: FormFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof FormFieldWrapper>;

export const Default: Story = {
  render: () => (
    <FormFieldWrapper label="Username" helperText="Enter your username">
      <input type="text" className="base-input" />
    </FormFieldWrapper>
  ),
};

export const RequiredWithError: Story = {
  render: () => (
    <FormFieldWrapper
      label="Email"
      required
      errorText="Email is invalid"
      helperText="We'll never share your email"
    >
      <input type="email" className="base-input" />
    </FormFieldWrapper>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <FormFieldWrapper
      label="Search"
      prefixIcon={<span>🔍</span>}
      suffixIcon={<span>❌</span>}
      helperText="Type your query"
    >
      <input type="text" className="base-input" />
    </FormFieldWrapper>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormFieldWrapper label="Disabled field" helperText="You cannot edit this field" disabled>
      <input type="text" className="base-input" />
    </FormFieldWrapper>
  ),
};
