'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { FormField } from '@/components/base/form/form-factory/FormFactory.types';
import { AuthPage } from '@/components/layout/pages/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorUtils';

const loginFormFields: FormField[] = [
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

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError('');

      await login(data);

      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <AuthPage<LoginFormData>
      title="Login to Atlas"
      fields={loginFormFields}
      schema={loginSchema}
      onSubmit={onSubmit}
      error={error}
      isLoading={isSubmitting}
    />
  );
};

export default LoginPage;
