import BaseButton from './BaseButton.vue'

const IconLeft = {
  template:
    '<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="currentColor" /></svg>',
}

const IconRight = {
  template:
    '<svg width="16" height="16"><rect width="16" height="16" fill="currentColor" /></svg>',
}

export default {
  title: 'UI/BaseButton',
  component: BaseButton,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'danger',
      ],
    },
    size: {
      control: 'select',
      options: [
        'small',
        'medium',
        'large',
      ],
    },
    iconOnly: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    label: { control: 'text' },
  },
}

type BaseButtonArgs = {
  label?: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  iconOnly?: boolean
  loading?: boolean
  disabled?: boolean
  ariaLabel?: string
}

const render = (args: BaseButtonArgs) => ({
  components: {
    BaseButton,
    IconLeft,
    IconRight,
  },
  setup() {
    return { args }
  },
  template: `
    <BaseButton v-bind="args">
      <template v-if="args.variant === 'primary' || args.iconOnly" #icon-left>
        <IconLeft />
      </template>

      <template v-if="!args.iconOnly">
        {{ args.label }}
      </template>

      <template v-if="args.variant === 'primary' && !args.iconOnly" #icon-right>
        <IconRight />
      </template>
    </BaseButton>
  `,
})

// ✅ Individual stories using the shared render function
export const Primary = {
  render,
  args: {
    label: 'Primary',
    variant: 'primary',
    size: 'medium',
  },
}

export const Secondary = {
  render,
  args: {
    label: 'Secondary',
    variant: 'secondary',
    size: 'medium',
  },
}

export const Danger = {
  render,
  args: {
    label: 'Danger',
    variant: 'danger',
    size: 'medium',
  },
}

export const Small = {
  render,
  args: {
    label: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
}

export const Large = {
  render,
  args: {
    label: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
}

export const Loading = {
  render,
  args: {
    label: 'Saving...',
    variant: 'primary',
    loading: true,
    size: 'medium',
  },
}

export const Disabled = {
  render,
  args: {
    label: 'Disabled',
    variant: 'primary',
    disabled: true,
    size: 'medium',
  },
}

export const IconOnly = {
  render,
  args: {
    iconOnly: true,
    variant: 'primary',
    size: 'medium',
    ariaLabel: 'Settings',
  },
}
