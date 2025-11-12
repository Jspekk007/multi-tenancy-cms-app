import './FormFactory.scss';

import React from 'react';
import { Controller, DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';

import { BaseButton } from '../../button/BaseButton';
import { Select } from '../select/Select';
import { Switch } from '../switch/Switch';
import { TextInput } from '../text-input/TextInput';
import { FormFactoryProps, FormField } from './FormFactory.types';

export const FormFactory = <T extends FieldValues>({
  fields,
  onSubmit,
  resetButton,
  defaultValues = {},
}: FormFactoryProps<T>): React.ReactNode => {
  const { control, handleSubmit } = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const renderField = (field: FormField): React.ReactNode => {
    switch (field.type) {
      case 'text':
      case 'password':
        return (
          <Controller
            key={field.name}
            name={field.name as Path<T>}
            control={control}
            render={({ field: controllerField }) => (
              <TextInput
                {...controllerField}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                disabled={field.disabled}
              />
            )}
          />
        );
      // Additional field types (e.g., select, checkbox) can be handled here
      case 'select':
        return (
          <Controller
            key={field.name}
            name={field.name as Path<T>}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                label={field.label}
                name={field.name}
                options={field.options ? field.options : []}
                value={value}
                disabled={field.disabled}
                onChange={onChange}
              />
            )}
          />
        );
      case 'switch':
        return (
          <Controller
            key={field.name}
            name={field.name as Path<T>}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                label={field.label}
                name={field.name}
                checked={value}
                disabled={field.disabled}
                onChange={onChange}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: '16px' }}>
          {renderField(field)}
        </div>
      ))}
      <div className="form-actions">
        <BaseButton variant="primary" type="submit" size="medium" iconVariant="primary">
          Submit
        </BaseButton>
        {resetButton && (
          <BaseButton
            variant="secondary"
            type="button"
            size="medium"
            iconVariant="secondary"
            onClick={() => {
              // Reset logic can be added here
            }}
          >
            Reset
          </BaseButton>
        )}
      </div>
    </form>
  );
};
