<template>
  <BaseDropdown>
    <template #trigger="dropdown">
      <BaseDropdownTrigger
        :trigger-ref="dropdown.triggerRef"
        :is-open="dropdown.isOpen"
        :toggle="dropdown.toggle"
        :menu-id="dropdown.menuId"
      >
        {{ selected?.label || 'Select a fruit' }}
      </BaseDropdownTrigger>
    </template>

    <template #menu="dropdown">
      <BaseDropdownMenu
        :menu-ref="dropdown.menuRef"
        :trigger-ref="dropdown.triggerRef"
      >
        <BaseDropdownItem
          v-for="option in options"
          :key="option.value"
          :close="dropdown.close"
          :on-select="() => select(option)"
        >
          {{ option.label }}
        </BaseDropdownItem>
      </BaseDropdownMenu>
    </template>
  </BaseDropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseDropdown from './BaseDropdown.vue'
import BaseDropdownTrigger from './BaseDropdownTrigger.vue'
import BaseDropdownMenu from './BaseDropdownMenu.vue'
import BaseDropdownItem from './BaseDropdownItem.vue'

// Define a type for our options for better type safety
interface FruitOption {
  label: string
  value: string
}

const options: FruitOption[] = [
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

// The selected ref will hold the entire option object, or null
const selected = ref<FruitOption | null>(null)

/**
 * Handles the selection of an item.
 * @param {FruitOption} option - The option object that was selected.
 */
const select = (option: FruitOption) => {
  selected.value = option
}
</script>
