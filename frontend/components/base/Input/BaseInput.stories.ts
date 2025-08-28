import BaseInput from './BaseInput.vue'
import type { BaseInputProps } from './BaseInput.vue'

export default {
  title: 'UI/BaseInput',
  component: BaseInput,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'The input value (v-model)',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '' },
      },
    },
    type: {
      control: { type: 'select' },
      options: [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'url',
      ],
      description: 'Input type',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { type: { summary: 'string' } },
    },
    label: {
      control: 'text',
      description: 'Label for the input',
      table: { type: { summary: 'string' } },
    },
    error: {
      control: 'text',
      description: 'Error message',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Read-only input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    size: {
      control: { type: 'select' },
      options: [
        'small',
        'medium',
        'large',
      ],
      description: 'Input size',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
  },
}

export const Default = (args: BaseInputProps) => ({
  components: { BaseInput },
  setup() {
    return { args }
  },
  template: '<BaseInput v-bind="args" />',
})

export const AllVariants = () => ({
  components: { BaseInput },
  data() {
    return {
      values: {
        small: '',
        medium: '',
        large: '',
        error: '',
        disabled: 'Disabled',
        readonly: 'Read only',
      },
    }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
      <BaseInput
        v-model="values.small"
        size="small"
        label="Small"
        placeholder="Small input"
      />
      <BaseInput
        v-model="values.medium"
        size="medium"
        label="Medium"
        placeholder="Medium input"
      />
      <BaseInput
        v-model="values.large"
        size="large"
        label="Large"
        placeholder="Large input"
      />
      <BaseInput
        v-model="values.error"
        size="medium"
        label="With error"
        placeholder="Error state"
        error="This field is required"
      />
      <BaseInput
        v-model="values.disabled"
        size="medium"
        label="Disabled"
        placeholder="Disabled input"
        :disabled="true"
      />
      <BaseInput
        v-model="values.readonly"
        size="medium"
        label="Read only"
        placeholder="Read only input"
        :readonly="true"
      />
    </div>
  `,
})
