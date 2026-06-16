import { BaseInput } from './BaseInput';
const meta = {
    title: 'UI/Form/BaseInput',
    component: BaseInput,
    args: {
        placeholder: 'Enter text...',
        disabled: false,
        size: 'medium',
        variant: 'default',
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        variant: {
            control: 'select',
            options: ['default', 'error', 'success'],
        },
    },
};
export default meta;
export const Default = {};
export const Small = {
    args: {
        size: 'small',
    },
};
export const Large = {
    args: {
        size: 'large',
    },
};
export const WithPrefix = {
    args: {
        prefix: <span>@</span>,
        placeholder: 'username',
    },
};
export const WithSuffix = {
    args: {
        suffix: <span>.com</span>,
        placeholder: 'website',
    },
};
export const Error = {
    args: {
        variant: 'error',
        placeholder: 'Invalid value',
    },
};
export const Success = {
    args: {
        variant: 'success',
    },
};
export const Disabled = {
    args: {
        disabled: true,
        placeholder: 'Disabled input',
    },
};
//# sourceMappingURL=BaseInput.stories.js.map