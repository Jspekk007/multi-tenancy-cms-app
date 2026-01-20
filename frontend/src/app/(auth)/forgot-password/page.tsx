'use client';

import './page.scss';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { FormField } from '@/components/base/form/form-factory/FormFactory.types';
import { Logo } from '@/components/base/logo/Logo';
import { AuthPage } from '@/components/layout/pages/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorUtils';

const forgotPasswordFormFields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Enter your email',
  },
];

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = (): JSX.Element => {
  const router = useRouter();
  const { user, isLoading, requestPasswordReset } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError('');
      const response = await requestPasswordReset(data.email);
      setMessage(response.message);

      setIsSuccess(true);
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
    <>
      {isSuccess && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <Logo assetType="symbol" size="large" />
            <h2 className="auth-title">Password Reset Requested</h2>
            <span className="auth-success-message">
              {message ||
                'If an account with that email exists, a password reset link has been sent.'}
            </span>
            <div className="auth-footer">
              <p>
                Remembered your password? <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      )}
      {!isSuccess && (
        <>
          <AuthPage<ForgotPasswordFormData>
            title="Forgot Password"
            fields={forgotPasswordFormFields}
            schema={forgotPasswordSchema}
            onSubmit={onSubmit}
            isLoading={isSubmitting}
            error={error}
          />
        </>
      )}
    </>
  );
};

export default ForgotPasswordPage;
