import './AuthPage.scss';

import { FieldValues, SubmitHandler } from 'react-hook-form';
import { ZodType } from 'zod';

import { FormFactory } from '@/components/base/form/form-factory/FormFactory';
import { FormField } from '@/components/base/form/form-factory/FormFactory.types';
import { Logo } from '@/components/base/logo/Logo';

interface AuthPageProps<T extends FieldValues> {
  title?: string;
  fields: FormField[];
  schema: ZodType;
  onSubmit: SubmitHandler<T>;
  error?: string;
  isLoading: boolean;
}

export const AuthPage = <T extends FieldValues>({
  title,
  fields,
  schema,
  onSubmit,
  error,
  isLoading,
}: AuthPageProps<T>): JSX.Element => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo-wrapper">
          <Logo assetType="symbol" size="large" />
        </div>
        {title && <h2 className="auth-title">{title}</h2>}
        {error && <div className="auth-error">{error}</div>}
        <FormFactory onSubmit={onSubmit} fields={fields} schema={schema} isLoading={isLoading} />
        {title?.includes('Login') && (
          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/auth/register">Register here</a>
            </p>
            <p>
              Forgot your password? <a href="/auth/forgot-password">Reset it</a>
            </p>
          </div>
        )}
        {title?.includes('Register') && (
          <div className="auth-footer">
            Already have an account? <a href="/auth/login">Login here</a>
          </div>
        )}
      </div>
    </div>
  );
};
