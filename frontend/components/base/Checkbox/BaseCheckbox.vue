<!--
  BaseCheckbox.vue
  - For a single checkbox input.
  - Use with BaseCheckboxGroup for grouped checkboxes.
-->
<template>
  <div
    class="base-checkbox-wrapper"
    :class="[{ disabled,
               error: !!error }]"
  >
    <label class="checkbox-label">
      <input
        ref="inputRef"
        class="base-checkbox"
        type="checkbox"
        :checked="modelValue === value"
        :value="value"
        :disabled="disabled"
        :aria-invalid="!!error || undefined"
        @change="onChange"
      />
      <span class="checkbox-custom"></span>
      <span class="checkbox-label-text">{{ label }}</span>
    </label>
    <span
      v-if="error"
      class="checkbox-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type BaseCheckboxProps = {
  modelValue?: string | number | boolean | Array<string | number | boolean>
  label?: string
  value: string | number | boolean
  disabled?: boolean
  error?: string
}

const { value } = defineProps({
  modelValue: [
    String,
    Number,
    Boolean,
    Array,
  ],
  label: String,
  value: {
    type: [
      String,
      Number,
      Boolean,
    ],
    required: true,
  },
  disabled: Boolean,
  error: String,
})

const emit = defineEmits(['update:modelValue'])
const inputRef = ref<HTMLInputElement | null>(null)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked ? value : undefined)
}
</script>

<style lang="scss" scoped>
.base-checkbox {
  appearance: none;
  width: 1.1em;
  height: 1.1em;
  border: 2px solid $gray-300;
  border-radius: 0.25em;
  margin-right: $spacing-2;
  background: $gray-50;
  transition: border-color 0.2s, box-shadow 0.2s;
  position: relative;

  &:checked {
    border-color: $color-primary;
    background: $color-primary;
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.15);
  }

  &:disabled {
    background: $gray-100;
    border-color: $gray-200;
    cursor: not-allowed;
  }
}

.base-checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &.error .base-checkbox {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba($color-danger, 0.1);
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: $font-size-base;
  color: $gray-900;
}

.checkbox-custom {
  display: none;
}

.checkbox-label-text {
  font-size: $font-size-base;
}

.checkbox-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
