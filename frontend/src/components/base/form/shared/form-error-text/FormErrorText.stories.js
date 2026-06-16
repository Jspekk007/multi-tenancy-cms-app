import React from 'react';
import { FormErrorText } from './FormErrorText';
import { BaseIcon } from '@/components/base/icon/BaseIcon';
const meta = {
    title: 'UI/Form/FormErrorText',
    component: FormErrorText,
};
export default meta;
export const Default = {
    args: {
        children: 'This field is required.',
    },
};
export const WithIcon = {
    args: {
        children: 'Invalid email address.',
        icon: <BaseIcon icon="alert"/>,
    },
};
//# sourceMappingURL=FormErrorText.stories.js.map