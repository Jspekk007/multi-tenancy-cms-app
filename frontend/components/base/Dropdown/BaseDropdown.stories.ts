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
