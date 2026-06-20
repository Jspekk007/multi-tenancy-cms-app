'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { AuthPage } from '@/components/features/pages/auth/AuthPage';
import { FormField } from '@/components/primitives/form/form-factory/FormFactory.types';
import { useAuth } from '@/hooks/useAuth';
import { AuthTenantOption, isTenantSelectionRequired } from '@/types/auth';
import { getErrorMessage } from '@/utils/errorUtils';

const loginFormFields: FormField[] = [
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
    placeholder: 'Enter your password',
    required: true,
  },
];

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const tenantSelectionSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
});

interface LoginFormData {
  email?: string;
  password?: string;
  tenantId?: string;
}

interface PendingCredentials {
  email: string;
  password: string;
}

const createTenantSelectionFields = (tenantOptions: AuthTenantOption[]): FormField[] => [
  {
    name: 'tenantId',
    label: 'Tenant',
    type: 'select',
    required: true,
    options: tenantOptions.map((tenant) => ({
      label: `${tenant.name} (${tenant.domain})`,
      value: tenant.id,
    })),
  },
];

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tenantOptions, setTenantOptions] = useState<AuthTenantOption[]>([]);
  const [pendingCredentials, setPendingCredentials] = useState<PendingCredentials | null>(null);

  const isTenantSelectionStep = tenantOptions.length > 0 && pendingCredentials !== null;
  const activeFields = isTenantSelectionStep
    ? createTenantSelectionFields(tenantOptions)
    : loginFormFields;
  const activeSchema = isTenantSelectionStep ? tenantSelectionSchema : loginSchema;

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError('');

      if (isTenantSelectionStep) {
        if (!pendingCredentials || !data.tenantId) {
          setError('Select a tenant to continue.');
          return;
        }

        const response = await login({
          ...pendingCredentials,
          tenantId: data.tenantId,
        });

        if (isTenantSelectionRequired(response)) {
          setError('Select a tenant to continue.');
          return;
        }

        router.push('/dashboard');
        return;
      }

      if (!data.email || !data.password) {
        setError('Email and password are required.');
        return;
      }

      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (isTenantSelectionRequired(response)) {
        setTenantOptions(response.tenants);
        setPendingCredentials({
          email: data.email,
          password: data.password,
        });
        return;
      }

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
      key={isTenantSelectionStep ? 'tenant-selection' : 'credentials'}
      title={isTenantSelectionStep ? 'Select Tenant' : 'Login to Atlas'}
      fields={activeFields}
      schema={activeSchema}
      onSubmit={onSubmit}
      error={error}
      isLoading={isSubmitting}
    />
  );
};

export default LoginPage;
