import BaseCheckboxGroup from './BaseCheckboxGroup.vue'
import type { BaseCheckboxGroupProps, CheckboxOption } from './BaseCheckboxGroup.vue'

const options: CheckboxOption[] = [
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
  title: 'UI/BaseCheckboxGroup',
  component: BaseCheckboxGroup,
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Checked values',
      table: { type: { summary: 'string[] | number[] | boolean[]' } },
    },
    options: {
      control: false,
      description: 'Options array',
      table: { type: { summary: 'CheckboxOption[]' } },
    },
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
}

export const Default = (args: BaseCheckboxGroupProps) => ({
  components: { BaseCheckboxGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseCheckboxGroup v-bind="args" :options="options" />',
})

Default.args = {
  modelValue: [],
  label: 'Choose options',
  error: '',
  disabled: false,
}

export const Error = (args: BaseCheckboxGroupProps) => ({
  components: { BaseCheckboxGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseCheckboxGroup v-bind="args" :options="options" error="This field is required" />',
})

export const Disabled = (args: BaseCheckboxGroupProps) => ({
  components: { BaseCheckboxGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseCheckboxGroup v-bind="args" :options="options" :disabled="true" />',
})
