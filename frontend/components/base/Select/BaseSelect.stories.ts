import BaseSelect from './BaseSelect.vue'
import type { BaseSelectProps, SelectOption } from './BaseSelect.vue'

const options: SelectOption[] = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
]

export default {
  title: 'UI/BaseSelect',
  component: BaseSelect,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value(s)',
      table: { type: { summary: 'string | number | string[] | number[]' } },
    },
    options: {
      control: false,
      description: 'Options array',
      table: { type: { summary: 'SelectOption[]' } },
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: [
        'small',
        'medium',
        'large',
      ],
    },
    multiple: { control: 'boolean' },
  },
}

export const Default = (args: BaseSelectProps) => ({
  components: { BaseSelect },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseSelect v-bind="args" :options="options" />',
})

Default.args = {
  modelValue: '',
  label: 'Select an option',
  placeholder: 'Choose...',
  size: 'medium',
  error: '',
  disabled: false,
  multiple: false,
}

export const MultiSelect = (args: BaseSelectProps) => ({
  components: { BaseSelect },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseSelect v-bind="args" :options="options" multiple />',
})

MultiSelect.args = {
  modelValue: [],
  label: 'Select multiple',
  placeholder: 'Choose...',
  size: 'medium',
  error: '',
  disabled: false,
  multiple: true,
}

export const AllVariants = () => ({
  components: { BaseSelect },
  setup() { return { options } },
  data() {
    return {
      single: '',
      multi: [],
      error: '',
      disabled: '',
    }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
      <BaseSelect v-model="single" :options="options" label="Small" size="small" placeholder="Small select" />
      <BaseSelect v-model="single" :options="options" label="Medium" size="medium" placeholder="Medium select" />
      <BaseSelect v-model="single" :options="options" label="Large" size="large" placeholder="Large select" />
      <BaseSelect v-model="multi" :options="options" label="Multi-select" multiple placeholder="Select multiple" />
      <BaseSelect v-model="error" :options="options" label="With error" error="This field is required" />
      <BaseSelect v-model="disabled" :options="options" label="Disabled" :disabled="true" placeholder="Disabled select" />
    </div>
  `,
})
