'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { AuthPage } from '@/components/layout/pages/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorUtils';
const loginFormFields = [
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Enter your email',
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
    },
];
const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string(),
});
const LoginPage = () => {
    const router = useRouter();
    const { login, user, isLoading } = useAuth();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            await login(data);
            router.push('/dashboard');
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
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
    return (<AuthPage title="Login to Atlas" fields={loginFormFields} schema={loginSchema} onSubmit={onSubmit} error={error} isLoading={isSubmitting}/>);
};
export default LoginPage;
//# sourceMappingURL=page.js.map