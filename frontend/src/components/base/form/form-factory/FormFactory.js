import './FormFactory.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BaseButton } from '../../button/BaseButton';
import { Select } from '../select/Select';
import { Switch } from '../switch/Switch';
import { TextInput } from '../text-input/TextInput';
export const FormFactory = ({ fields, onSubmit, resetButton, defaultValues, schema, isLoading = false, }) => {
    const resolver = schema
        ? zodResolver(schema)
        : undefined;
    const { control, handleSubmit } = useForm({
        resolver,
        defaultValues,
    });
    const renderField = (field) => {
        switch (field.type) {
            case 'text':
            case 'password':
                return (<>
            <Controller key={field.name} name={field.name} control={control} render={({ field: controllerField, fieldState }) => (<TextInput {...controllerField} value={controllerField.value || ''} type={field.type} label={field.label} placeholder={field.placeholder} disabled={field.disabled} error={fieldState.error?.message} showPasswordToggle={field.type === 'password' ? true : false} showPasswordStrength={field.showPasswordStrength} required={field.required ? true : false}/>)}/>
          </>);
            // Additional field types (e.g., select, checkbox) can be handled here
            case 'select':
                return (<Controller key={field.name} name={field.name} control={control} render={({ field: { value, onChange }, fieldState }) => (<Select label={field.label} name={field.name} options={field.options ? field.options : []} value={value ?? ''} disabled={field.disabled} onChange={onChange} error={fieldState.error?.message} required={field.required ? true : false}/>)}/>);
            case 'switch':
                return (<Controller key={field.name} name={field.name} control={control} render={({ field: { value, onChange }, fieldState }) => (<Switch label={field.label} name={field.name} checked={!!value} disabled={field.disabled} onChange={onChange} error={fieldState.error?.message} required={field.required ? true : false}/>)}/>);
            default:
                return null;
        }
    };
    return (<form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (<div key={field.name} style={{ marginBottom: '16px' }}>
          {renderField(field)}
        </div>))}
      <div className="form-actions">
        <BaseButton variant="primary" type="submit" size="medium" iconVariant="primary" disabled={isLoading || control._formState.isSubmitting} loading={isLoading || control._formState.isSubmitting}>
          Submit
        </BaseButton>
        {resetButton && (<BaseButton variant="secondary" type="button" size="medium" iconVariant="secondary" onClick={() => { }} disabled={isLoading || control._formState.isSubmitting}>
            Reset
          </BaseButton>)}
      </div>
    </form>);
};
//# sourceMappingURL=FormFactory.js.map