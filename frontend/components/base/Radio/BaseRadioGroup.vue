<!--
  BaseRadioGroup.vue
  - For grouping multiple BaseRadio components.
  - Handles keyboard navigation and value management.
-->
<template>
  <div
    class="base-radio-group-wrapper"
    :class="[{ disabled, error: !!error }]"
    role="radiogroup"
    :aria-labelledby="labelId"
    :aria-invalid="!!error || undefined"
  >
    <span
      v-if="label"
      :id="labelId"
      class="radio-group-label"
    >{{ label }}</span>
    <div class="radio-group-options">
      <BaseRadio
        v-for="option in options"
        :key="String((option as RadioOption).value)"
        v-bind="{
          modelValue,
          'onUpdate:modelValue': $emit.bind(null, 'update:modelValue'),
          'label': (option as RadioOption).label,
          'value': (option as RadioOption).value,
          name,
          'disabled': disabled || (option as RadioOption).disabled,
          'error': undefined,
        }"
      />
    </div>
    <span
      v-if="error"
      class="radio-group-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseRadio from './BaseRadio.vue'

export type RadioOption = { label: string, value: string | number | boolean, disabled?: boolean }
export type BaseRadioGroupProps = {
  modelValue?: string | number | boolean
  options: RadioOption[]
  label?: string
  error?: string
  disabled?: boolean
  name?: string
}

defineProps({
  modelValue: [
    String,
    Number,
    Boolean,
  ],
  options: {
    type: Array,
    required: true,
  },
  label: String,
  error: String,
  disabled: Boolean,
  name: String,
})

const labelId = computed(() => `base-radio-group-label-${Math.random().toString(36).slice(2, 10)}`)
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/tokens/colors' as *;
@use '../../../assets/scss/tokens/typography' as *;
@use '../../../assets/scss/tokens/spacing' as *;

.base-radio-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &.error .base-radio {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba($color-danger, 0.1);
  }
}

.radio-group-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.radio-group-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.radio-group-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
