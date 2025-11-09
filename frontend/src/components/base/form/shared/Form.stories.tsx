import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormFieldWrapper } from './form-field-wrapper/FormFieldWrapper';
import { BaseIcon } from '@/components/base/icon/BaseIcon';
import './Form.scss'; // optional global form styles for layout

const meta: Meta = {
  title: 'Form/FullForm',
  component: FormFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof FormFieldWrapper>;

export const Default: Story = {
  render: () => (
    <form className="demo-form">
      {/* Username */}
      <FormFieldWrapper label="Username" required helperText="Enter your username">
        <input type="text" className="base-input" placeholder="john_doe" />
      </FormFieldWrapper>

      {/* Email */}
      <FormFieldWrapper
        label="Email"
        required
        helperText="We'll never share your email."
        errorText="Invalid email address"
      >
        <input type="email" className="base-input" placeholder="example@mail.com" />
      </FormFieldWrapper>

      {/* Password */}
      <FormFieldWrapper label="Password" required helperText="Must be at least 8 characters.">
        <input type="password" className="base-input" placeholder="********" />
      </FormFieldWrapper>

      {/* Search with icons */}
      <FormFieldWrapper
        label="Search"
        helperText="Search for something"
        prefixIcon={<BaseIcon icon="search" />}
        suffixIcon={<BaseIcon icon="close" />}
      >
        <input type="text" className="base-input" placeholder="Search..." />
      </FormFieldWrapper>

      {/* Disabled input */}
      <FormFieldWrapper label="Disabled field" helperText="This field cannot be edited" disabled>
        <input type="text" className="base-input" value="Disabled value" />
      </FormFieldWrapper>
    </form>
  ),
};
