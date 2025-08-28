// BasicDropdown.stories.ts

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'

// 1. Import the actual components, not the wrapper
import BaseDropdown from './BaseDropdown.vue'
import BaseDropdownTrigger from './BaseDropdownTrigger.vue'
import BaseDropdownMenu from './BaseDropdownMenu.vue'
import BaseDropdownItem from './BaseDropdownItem.vue'

type FruitOption = {
  label: string
  value: string
}

type Args = {
  options: FruitOption[]
  selected: FruitOption | null
  onSelect: (option: FruitOption) => void
}

const meta: Meta<Args> = {
  title: 'UI/BaseDropdown',
  component: BaseDropdown,
  argTypes: {
    options: { control: 'object' },
    selected: { control: 'object' },
    onSelect: { action: 'selected' },
  },
}

export default meta
type Story = StoryObj<Args>

// An example array of options
const fruitOptions: FruitOption[] = [
  {
    label: '🍎 Apple',
    value: 'apple',
  },
  {
    label: '🍌 Banana',
    value: 'banana',
  },
  {
    label: '🍒 Cherry',
    value: 'cherry',
  },
  {
    label: '🐉 Dragonfruit',
    value: 'dragonfruit',
  },
]

export const Default: Story = {
  // Use a render function to dynamically build the component
  render: (args: Args) => ({
    components: {
      BaseDropdown,
      BaseDropdownTrigger,
      BaseDropdownMenu,
      BaseDropdownItem,
    },
    setup() {
      // Manage the selected state locally within the story
      const selectedItem = ref(args.selected)

      // Keep the local state in sync with Storybook's controls
      watch(
        () => args.selected,
        (newVal) => {
          selectedItem.value = newVal
        },
      )

      // The function that handles the selection
      const handleSelect = (option: FruitOption) => {
        selectedItem.value = option
        // Call the Storybook action so it gets logged
        args.onSelect(option)
      }

      return {
        args,
        selectedItem,
        handleSelect,
      }
    },
    // Use named slots per BaseDropdown's API
    template: `
      <BaseDropdown>
        <template #trigger="dropdown">
          <BaseDropdownTrigger
            :trigger-ref="dropdown.triggerRef"
            :is-open="dropdown.isOpen"
            :toggle="dropdown.toggle"
            :menu-id="dropdown.menuId"
          >
            {{ selectedItem?.label || 'Select a fruit' }}
          </BaseDropdownTrigger>
        </template>

        <template #menu="dropdown">
          <BaseDropdownMenu
            :menu-ref="dropdown.menuRef"
            :trigger-ref="dropdown.triggerRef"
          >
            <BaseDropdownItem
              v-for="option in args.options"
              :key="option.value"
              :close="dropdown.close"
              :on-select="() => handleSelect(option)"
            >
              {{ option.label }}
            </BaseDropdownItem>
          </BaseDropdownMenu>
        </template>
      </BaseDropdown>
    `,
  }),
  // Define the default values for the args
  args: {
    options: fruitOptions,
    selected: null,
  },
}

// Preselected item story
export const WithPreselected: Story = {
  render: Default.render,
  args: {
    options: fruitOptions,
    selected: fruitOptions[1],
  },
}

// Many options (scroll/long list) story
const manyOptions: FruitOption[] = [
  ...fruitOptions,
  {
    label: '🥭 Mango',
    value: 'mango',
  },
  {
    label: '🍍 Pineapple',
    value: 'pineapple',
  },
  {
    label: '🍓 Strawberry',
    value: 'strawberry',
  },
  {
    label: '🍑 Peach',
    value: 'peach',
  },
  {
    label: '🍐 Pear',
    value: 'pear',
  },
  {
    label: '🍊 Orange',
    value: 'orange',
  },
  {
    label: '🍇 Grape',
    value: 'grape',
  },
  {
    label: '🥝 Kiwi',
    value: 'kiwi',
  },
  {
    label: '🍈 Melon',
    value: 'melon',
  },
]

export const WithManyOptions: Story = {
  render: Default.render,
  args: {
    options: manyOptions,
    selected: null,
  },
}

// Long labels to test truncation in trigger
const longLabelOptions: FruitOption[] = [
  {
    label: '🍎 Apple – A very long description that should be truncated in the trigger to avoid layout shifts',
    value: 'apple-long',
  },
  {
    label: '🍌 Banana – Another extremely verbose label to ensure ellipsis styling works as intended',
    value: 'banana-long',
  },
  {
    label: '🍒 Cherry – Lengthy label example to test overflow handling in UI',
    value: 'cherry-long',
  },
]

export const WithLongLabels: Story = {
  render: Default.render,
  args: {
    options: longLabelOptions,
    selected: null,
  },
}

// Empty options list
export const EmptyOptions: Story = {
  render: Default.render,
  args: {
    options: [],
    selected: null,
  },
}

// Custom trigger content (e.g., with a leading icon)
export const CustomTrigger: Story = {
  render: (args: Args) => ({
    components: {
      BaseDropdown,
      BaseDropdownTrigger,
      BaseDropdownMenu,
      BaseDropdownItem,
    },
    setup() {
      const selectedItem = ref(args.selected)
      watch(
        () => args.selected,
        (newVal) => {
          selectedItem.value = newVal
        },
      )
      const handleSelect = (option: FruitOption) => {
        selectedItem.value = option
        args.onSelect(option)
      }
      return {
        args,
        selectedItem,
        handleSelect,
      }
    },
    template: `
      <BaseDropdown>
        <template #trigger="dropdown">
          <BaseDropdownTrigger
            :trigger-ref="dropdown.triggerRef"
            :is-open="dropdown.isOpen"
            :toggle="dropdown.toggle"
            :menu-id="dropdown.menuId"
          >
            <span style="margin-right: 0.5rem">🍽️</span>
            {{ selectedItem?.label || 'Choose a fruit' }}
          </BaseDropdownTrigger>
        </template>

        <template #menu="dropdown">
          <BaseDropdownMenu
            :menu-ref="dropdown.menuRef"
            :trigger-ref="dropdown.triggerRef"
          >
            <BaseDropdownItem
              v-for="option in args.options"
              :key="option.value"
              :close="dropdown.close"
              :on-select="() => handleSelect(option)"
            >
              {{ option.label }}
            </BaseDropdownItem>
          </BaseDropdownMenu>
        </template>
      </BaseDropdown>
    `,
  }),
  args: {
    options: fruitOptions,
    selected: null,
  },
}
