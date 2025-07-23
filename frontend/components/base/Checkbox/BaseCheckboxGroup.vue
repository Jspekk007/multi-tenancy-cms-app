<!--
  BaseCheckboxGroup.vue
  - For grouping multiple BaseCheckbox components.
  - Handles value management for checkbox groups.
-->
<template>
  <div
    class="base-checkbox-group-wrapper"
    :class="[{ disabled, error: !!error }]"
    role="group"
    :aria-labelledby="labelId"
    :aria-invalid="!!error || undefined"
  >
    <span
      v-if="label"
      :id="labelId"
      class="checkbox-group-label"
    >{{ label }}</span>
    <div class="checkbox-group-options">
      <BaseCheckbox
        v-for="option in options"
        :key="String((option as CheckboxOption).value)"
        v-bind="{
          modelValue,
          'onUpdate:modelValue': $emit.bind(null, 'update:modelValue'),
          'label': (option as CheckboxOption).label,
          'value': (option as CheckboxOption).value,
          'disabled': disabled || (option as CheckboxOption).disabled,
          'error': undefined,
        }"
      />
    </div>
    <span
      v-if="error"
      class="checkbox-group-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

export type CheckboxOption = { label: string, value: string | number | boolean, disabled?: boolean }
export type BaseCheckboxGroupProps = {
  modelValue?: Array<string | number | boolean>
  options: CheckboxOption[]
  label?: string
  error?: string
  disabled?: boolean
}

defineProps({
  modelValue: Array,
  options: {
    type: Array,
    required: true,
  },
  label: String,
  error: String,
  disabled: Boolean,
})

const labelId = computed(() => `base-checkbox-group-label-${Math.random().toString(36).slice(2, 10)}`)
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/tokens/colors' as *;
@use '../../../assets/scss/tokens/typography' as *;
@use '../../../assets/scss/tokens/spacing' as *;

.base-checkbox-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
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

.checkbox-group-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.checkbox-group-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.checkbox-group-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
