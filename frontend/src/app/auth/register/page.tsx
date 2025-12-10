'use client';

import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { FormField } from '@/components/base/form/form-factory/FormFactory.types';
import { AuthPage } from '@/components/layout/pages/auth/AuthPage';

const registerFormFields: FormField[] = [
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
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    domain: z.string().min(3, 'Domain must be at least 3 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .omit({ confirmPassword: true })
  .required({ name: true, email: true, password: true, domain: true });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage(): JSX.Element {
  const router = useRouter();
  const { register, user, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError('');
      await register(data);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err?.message : 'Registration failed. Please try again.');
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
    <AuthPage<RegisterFormData>
      title="Register for Atlas"
      fields={registerFormFields}
      schema={registerSchema}
      onSubmit={onSubmit}
      error={error}
      isLoading={isSubmitting}
    />
  );
}
