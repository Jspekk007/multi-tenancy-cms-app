import { FormFactory } from './FormFactory';
import { z } from 'zod';
const meta = {
    title: 'UI/Form/FormFactory',
    component: FormFactory,
    tags: ['autodocs'],
};
export default meta;
// Fields definition
const fields = [
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
    },
    {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
            { label: 'User', value: 'user' },
            { label: 'Admin', value: 'admin' },
        ],
    },
    {
        name: 'notifications',
        label: 'Enable Notifications',
        type: 'switch',
    },
];
const validationSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().min(1, 'Please select a role'), // Ensures a selection is made
    notifications: z.boolean().optional(),
});
// Default story
export const Default = {
    args: {
        fields,
        onSubmit: (data) => console.log('Form Submitted', data),
    },
};
// With default values story
export const WithDefaultValues = {
    args: {
        fields,
        defaultValues: {
            username: 'john_doe',
            password: '', // optional
            role: 'admin', // matches Select.options.value
            notifications: true, // switch checked
        },
        onSubmit: (data) => console.log('Form Submitted with Default Values', data),
    },
};
export const withResetButton = {
    args: {
        fields,
        resetButton: true,
        onSubmit: (data) => console.log('Form Submitted with Reset Button', data),
    },
};
export const WithValidation = {
    args: {
        fields,
        schema: validationSchema, // Pass the schema here
        onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
    },
    parameters: {
        docs: {
            description: {
                story: 'This form prevents submission until the Zod schema is satisfied. Try clicking "Submit" with empty fields.',
            },
        },
    },
};
//# sourceMappingURL=FormFactory.stories.js.map