import React from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';
const meta = {
    title: 'UI/Form/FormFieldWrapper',
    component: FormFieldWrapper,
};
export default meta;
export const Default = {
    render: () => (<FormFieldWrapper label="Username" helperText="Enter your username">
      <input type="text" className="base-input"/>
    </FormFieldWrapper>),
};
export const RequiredWithError = {
    render: () => (<FormFieldWrapper label="Email" required errorText="Email is invalid" helperText="We'll never share your email">
      <input type="email" className="base-input"/>
    </FormFieldWrapper>),
};
export const WithIcons = {
    render: () => (<FormFieldWrapper label="Search" prefixIcon={<span>🔍</span>} suffixIcon={<span>❌</span>} helperText="Type your query">
      <input type="text" className="base-input"/>
    </FormFieldWrapper>),
};
export const Disabled = {
    render: () => (<FormFieldWrapper label="Disabled field" helperText="You cannot edit this field" disabled>
      <input type="text" className="base-input"/>
    </FormFieldWrapper>),
};
//# sourceMappingURL=FormFieldWrapper.stories.js.map