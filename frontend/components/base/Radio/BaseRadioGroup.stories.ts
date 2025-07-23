import BaseRadioGroup from './BaseRadioGroup.vue'
import type { BaseRadioGroupProps, RadioOption } from './BaseRadioGroup.vue'

const options: RadioOption[] = [
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
  title: 'UI/BaseRadioGroup',
  component: BaseRadioGroup,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value',
      table: { type: { summary: 'string | number | boolean' } },
    },
    options: {
      control: false,
      description: 'Options array',
      table: { type: { summary: 'RadioOption[]' } },
    },
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
  },
}

export const Default = (args: BaseRadioGroupProps) => ({
  components: { BaseRadioGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseRadioGroup v-bind="args" :options="options" />',
})

Default.args = {
  modelValue: '',
  label: 'Choose an option',
  error: '',
  disabled: false,
  name: 'group1',
}

export const Error = (args: BaseRadioGroupProps) => ({
  components: { BaseRadioGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseRadioGroup v-bind="args" :options="options" error="This field is required" />',
})

export const Disabled = (args: BaseRadioGroupProps) => ({
  components: { BaseRadioGroup },
  setup() {
    return {
      args,
      options,
    }
  },
  template: '<BaseRadioGroup v-bind="args" :options="options" :disabled="true" />',
})
