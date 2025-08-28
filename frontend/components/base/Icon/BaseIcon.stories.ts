import BaseIcon from './BaseIcon.vue'

interface BaseIconArgs {
  name?: string
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
}

const iconNames = [
  'Check',
  'Loading',
  'Home',
  'Search',
  'User',
  'Settings',
  'Menu',
  'Close',
  'ArrowRight',
  'ArrowLeft',
  'Plus',
  'Minus',
  'Edit',
  'Trash',
  'Info',
  'Alert',
]

export default {
  title: 'UI/BaseIcon',
  component: BaseIcon,
}

export const Default = (args: BaseIconArgs) => ({
  components: { BaseIcon },
  setup() {
    return { args }
  },
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <BaseIcon v-bind="args" />
      <span>{{ args.name || 'No icon' }}</span>
    </div>
  `,
})

Default.args = {
  name: 'Check',
  size: 'medium',
  ariaLabel: 'Checkmark icon',
}

export const AllIcons = () => ({
  components: { BaseIcon },
  setup() {
    return { iconNames }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
      <div v-for="name in iconNames" :key="name" style="display: flex; flex-direction: column; align-items: center; width: 80px;">
        <BaseIcon :name="name" size="large" />
        <span style="margin-top: 0.5rem; font-size: 0.9rem;">{{ name }}</span>
      </div>
    </div>
  `,
})
