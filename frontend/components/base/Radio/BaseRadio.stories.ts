import BaseRadio from './BaseRadio.vue'
import type { BaseRadioProps } from './BaseRadio.vue'

export default {
  title: 'UI/BaseRadio',
  component: BaseRadio,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value',
      table: { type: { summary: 'string | number | boolean' } },
    },
    label: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
}

export const Default = (args: BaseRadioProps) => ({
  components: { BaseRadio },
  setup() { return { args } },
  template: '<BaseRadio v-bind="args" />',
})

Default.args = {
  modelValue: '',
  label: 'Radio label',
  value: 'radio1',
  name: 'group1',
  disabled: false,
  error: '',
}

export const Error = (args: BaseRadioProps) => ({
  components: { BaseRadio },
  setup() { return { args } },
  template: '<BaseRadio v-bind="args" error="This field is required" />',
})

export const Disabled = (args: BaseRadioProps) => ({
  components: { BaseRadio },
  setup() { return { args } },
  template: '<BaseRadio v-bind="args" :disabled="true" />',
})
