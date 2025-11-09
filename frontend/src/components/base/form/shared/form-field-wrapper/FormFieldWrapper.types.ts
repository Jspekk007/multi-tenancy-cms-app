import React from 'react';

export interface FormFieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
