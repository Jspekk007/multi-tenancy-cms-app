import './FormError.scss';
import { FormError } from './FormError';
const meta = {
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
export const Default = {
    args: {
        message: 'This field is required.',
    },
};
//# sourceMappingURL=FormError.stories.js.map