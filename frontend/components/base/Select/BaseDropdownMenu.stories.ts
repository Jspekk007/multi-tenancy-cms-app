import { ref } from 'vue'
import BaseDropdownMenu from './BaseDropdownMenu.vue'

export default {
  title: 'UI/BaseDropdownMenu',
  component: BaseDropdownMenu,
  argTypes: {
    trigger: {
      control: false,
      description: 'Slot for the trigger element (button, input, etc.)',
    },
    content: {
      control: false,
      description: 'Slot for the dropdown content (list, custom content, etc.)',
    },
  },
}

export const Default = () => ({
  components: { BaseDropdownMenu },
  setup() {
    const selected = ref<number | null>(null)
    const options = [
      {
        label: 'Option 1',
        value: 1,
      },
      {
        label: 'Option 2',
        value: 2,
      },
      {
        label: 'Option 3',
        value: 3,
      },
    ]
    const dropdownRef = ref()
    const selectOption = (option: { label: string, value: number }) => {
      selected.value = option.value
      // Close the dropdown
      dropdownRef.value?.close()
    }
    return {
      selected,
      options,
      selectOption,
      dropdownRef,
    }
  },
  template: `
    <BaseDropdownMenu ref="dropdownRef">
      <template #trigger>
        <button type="button">Dropdown Trigger</button>
      </template>
      <template #content>
        <ul style="list-style: none; margin: 0; padding: 0;">
          <li
            v-for="(option, i) in options"
            :key="option.value"
            role="option"
            tabindex="-1"
            @click="selectOption(option)"
            :style="{
              padding: '0.5rem 1.5rem',
              cursor: 'pointer',
              background: selected === option.value ? '#e5e7eb' : 'transparent',
            }"
          >
            {{ option.label }}
          </li>
        </ul>
      </template>
    </BaseDropdownMenu>
    <div style="margin-top: 1rem;">Selected: {{ selected }}</div>
  `,
})

export const CustomContent = () => ({
  components: { BaseDropdownMenu },
  template: `
    <BaseDropdownMenu>
      <template #trigger>
        <button type="button">Custom Trigger</button>
      </template>
      <template #content>
        <div style="padding: 1rem;">
          <strong>Custom content here!</strong>
          <p>This can be anything, not just a list of options.</p>
        </div>
      </template>
    </BaseDropdownMenu>
  `,
})
