import BaseCheckbox from './BaseCheckbox.vue'
import type { BaseCheckboxProps } from './BaseCheckbox.vue'

export default {
  title: 'UI/BaseCheckbox',
  component: BaseCheckbox,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Checked value',
      table: { type: { summary: 'string | number | boolean | string[] | number[] | boolean[]' } },
    },
    label: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
}

export const Default = (args: BaseCheckboxProps) => ({
  components: { BaseCheckbox },
  setup() { return { args } },
  template: '<BaseCheckbox v-bind="args" />',
})

Default.args = {
  modelValue: '',
  label: 'Checkbox label',
  value: 'check1',
  disabled: false,
  error: '',
}

export const Error = (args: BaseCheckboxProps) => ({
  components: { BaseCheckbox },
  setup() { return { args } },
  template: '<BaseCheckbox v-bind="args" error="This field is required" />',
})

export const Disabled = (args: BaseCheckboxProps) => ({
  components: { BaseCheckbox },
  setup() { return { args } },
  template: '<BaseCheckbox v-bind="args" :disabled="true" />',
})
