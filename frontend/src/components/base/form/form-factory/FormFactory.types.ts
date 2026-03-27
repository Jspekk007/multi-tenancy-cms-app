import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import type { ZodType } from 'zod';

export interface FormFactoryProps<TFieldValues extends FieldValues> {
  fields: FormField[];
  onSubmit: SubmitHandler<TFieldValues>;
  resetButton?: boolean;
  defaultValues?: DefaultValues<TFieldValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: ZodType<any, any, any>;
  isLoading: boolean;
}

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox' | 'switch';
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showPasswordStrength?: boolean;
};
