import BaseTextarea from './BaseTextarea.vue'
import type { BaseTextareaProps } from './BaseTextarea.vue'

export default {
  title: 'UI/BaseTextarea',
  component: BaseTextarea,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Textarea value',
      table: { type: { summary: 'string' } },
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: [
        'small',
        'medium',
        'large',
      ],
    },
  },
}

export const Default = (args: BaseTextareaProps) => ({
  components: { BaseTextarea },
  setup() { return { args } },
  template: '<BaseTextarea v-bind="args" />',
})

Default.args = {
  modelValue: '',
  label: 'Textarea label',
  placeholder: 'Type here...',
  size: 'medium',
  error: '',
  disabled: false,
  readonly: false,
}

export const AllVariants = () => ({
  components: { BaseTextarea },
  data() {
    return {
      small: '',
      medium: '',
      large: '',
      error: '',
      disabled: '',
      readonly: 'Read only',
    }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
      <BaseTextarea v-model="small" label="Small" size="small" placeholder="Small textarea" />
      <BaseTextarea v-model="medium" label="Medium" size="medium" placeholder="Medium textarea" />
      <BaseTextarea v-model="large" label="Large" size="large" placeholder="Large textarea" />
      <BaseTextarea v-model="error" label="With error" error="This field is required" />
      <BaseTextarea v-model="disabled" label="Disabled" :disabled="true" placeholder="Disabled textarea" />
      <BaseTextarea v-model="readonly" label="Read only" :readonly="true" placeholder="Read only textarea" />
    </div>
  `,
})
