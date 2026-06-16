'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { AuthPage } from '@/components/layout/pages/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorUtils';
import { validatePassword } from '@/utils/passwordValidation';
const registerFormFields = [
    {
        name: 'name',
        label: 'Organization Name',
        type: 'text',
        placeholder: 'Enter your organization name',
        required: true,
    },
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Enter your email',
        required: true,
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        required: true,
        showPasswordStrength: true,
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        required: true,
    },
    {
        name: 'domain',
        label: 'Domain',
        type: 'text',
        placeholder: 'yourdomain.com',
        required: true,
    },
];
const registerSchema = z
    .object({
    name: z.string().min(2, 'Organization name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().superRefine((value, ctx) => {
        const { score } = validatePassword(value);
        if (score < 3) {
            ctx.addIssue({
                code: 'custom',
                message: `Password strength is too weak. Please choose a stronger password.`,
            });
        }
    }),
    confirmPassword: z.string(),
    domain: z.string().min(3, 'Domain must be at least 3 characters'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export default function RegisterPage() {
    const router = useRouter();
    const { register, user, isLoading } = useAuth();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            await register(data);
            router.push('/dashboard');
        }
        catch (err) {
            const userFriendlyError = getErrorMessage(err);
            setError(userFriendlyError || 'Registration failed. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    useEffect(() => {
        if (user && !isLoading) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);
    return (<AuthPage title="Register for Atlas" fields={registerFormFields} schema={registerSchema} onSubmit={onSubmit} error={error} isLoading={isSubmitting}/>);
}
//# sourceMappingURL=page.js.map