import BaseIcon from '../Icon/BaseIcon.vue'
import BaseButton from './BaseButton.vue'

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
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
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
  iconLeft?: string
  iconRight?: string
}

const render = (args: BaseButtonArgs) => ({
  components: {
    BaseButton,
    BaseIcon,
  },
  setup() {
    return { args }
  },
  template: `
    <BaseButton v-bind="args">
      <template v-if="args.iconLeft" #icon-left>
        <BaseIcon :name="args.iconLeft" size="large" />
      </template>

      <template v-if="!args.iconOnly">
        {{ args.label }}
      </template>

      <template v-if="(args.iconRight && args.variant === 'primary' && !args.iconOnly)" #icon-right>
        <BaseIcon :name="args.iconRight" size="large" />
      </template>
    </BaseButton>
  `,
})

export const Primary = {
  render,
  args: {
    label: 'Primary',
    variant: 'primary',
    size: 'medium',
    iconLeft: 'Home',
    iconRight: '',
  },
}

export const Secondary = {
  render,
  args: {
    label: 'Secondary',
    variant: 'secondary',
    size: 'medium',
    iconLeft: '',
    iconRight: '',
  },
}

export const Danger = {
  render,
  args: {
    label: 'Danger',
    variant: 'danger',
    size: 'medium',
    iconLeft: 'Alert',
    iconRight: '',
  },
}

export const Small = {
  render,
  args: {
    label: 'Small Button',
    variant: 'primary',
    size: 'small',
    iconLeft: 'Minus',
    iconRight: '',
  },
}

export const Large = {
  render,
  args: {
    label: 'Large Button',
    variant: 'primary',
    size: 'large',
    iconLeft: 'Plus',
    iconRight: '',
  },
}

export const Loading = {
  render,
  args: {
    label: 'Saving...',
    variant: 'primary',
    loading: true,
    size: 'medium',
    iconLeft: 'Loading',
    iconRight: '',
  },
}

export const Disabled = {
  render,
  args: {
    label: 'Disabled',
    variant: 'primary',
    disabled: true,
    size: 'medium',
    iconLeft: 'Info',
    iconRight: '',
  },
}

export const IconOnly = {
  render,
  args: {
    iconOnly: true,
    variant: 'primary',
    size: 'medium',
    ariaLabel: 'Settings',
    iconLeft: 'Settings', // <-- Must match the file name exactly!
    iconRight: '',
  },
}
