<!--
  BaseInput.vue
  - For single-line text, number, email, etc. inputs only.
  - For select, radio, checkbox, textarea: use the corresponding base component (BaseSelect, BaseRadio, BaseCheckbox, BaseTextarea).
-->
<template>
  <div
    class="base-input-wrapper"
    :class="[size, { disabled,
                     error: !!error }]"
  >
    <label
      v-if="label"
      :for="inputId"
      class="input-label"
    >{{ label }}</label>
    <input
      :id="inputId"
      ref="inputRef"
      class="base-input"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      v-bind="$attrs"
      :value="modelValue"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <span
      v-if="error"
      :id="errorId"
      class="input-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { oneOf } from '../../../utils/validators'

export type BaseInputProps = {
  modelValue?: string | number
  type?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
}

defineProps({
  modelValue: [
    String,
    Number,
  ],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  label: String,
  error: String,
  disabled: Boolean,
  readonly: Boolean,
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium',
    validator: oneOf([
      'small',
      'medium',
      'large',
    ]),
  },
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const inputId = computed(() => `base-input-${Math.random().toString(36).slice(2, 10)}`)
const errorId = computed(() => `${inputId.value}-error`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: $gray-900;
  background: $gray-50;
  border: 1px solid $gray-300;
  border-radius: 0.5rem;
  padding: $spacing-3 $spacing-4;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.15);
  }

  &:disabled,
  &[readonly] {
    background: $gray-100;
    color: $gray-500;
    cursor: not-allowed;
  }
}

.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &.error .base-input {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba($color-danger, 0.1);
  }
}

.input-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.base-input-wrapper.small .base-input {
  font-size: $font-size-sm;
  padding: $spacing-2 $spacing-3;
}

.base-input-wrapper.medium .base-input {
  font-size: $font-size-base;
  padding: $spacing-3 $spacing-4;
}

.base-input-wrapper.large .base-input {
  font-size: $font-size-lg;
  padding: $spacing-4 $spacing-5;
}

.input-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
