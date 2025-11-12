import type { FieldValues } from 'react-hook-form';
import type { ZodType } from 'zod';

export interface FormFactoryProps<T extends FieldValues> {
  fields: FormField[];
  onSubmit: (data: T) => void;
  resetButton?: boolean;
  defaultValues?: Partial<T>;
  schema?: ZodType<T>;
}

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox' | 'switch';
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
};
