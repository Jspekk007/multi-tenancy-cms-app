<!--
  BaseRadio.vue
  - For a single radio button input.
  - Use with BaseRadioGroup for grouped radio options.
-->
<template>
  <div
    class="base-radio-wrapper"
    :class="[{ disabled, error: !!error }]"
  >
    <label class="radio-label">
      <input
        ref="inputRef"
        class="base-radio"
        type="radio"
        :name="name"
        :value="value"
        :checked="modelValue === value"
        :disabled="disabled"
        :aria-invalid="!!error || undefined"
        @change="onChange"
      />
      <span class="radio-custom"></span>
      <span class="radio-label-text">{{ label }}</span>
    </label>
    <span
      v-if="error"
      class="radio-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type BaseRadioProps = {
  modelValue?: string | number | boolean
  label?: string
  value: string | number | boolean
  name?: string
  disabled?: boolean
  error?: string
}

defineProps({
  modelValue: [
    String,
    Number,
    Boolean,
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
  name: String,
  disabled: Boolean,
  error: String,
})

const emit = defineEmits(['update:modelValue'])
const inputRef = ref<HTMLInputElement | null>(null)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.base-radio {
  appearance: none;
  width: 1.1em;
  height: 1.1em;
  border: 2px solid $gray-300;
  border-radius: 50%;
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

.base-radio-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
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

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: $font-size-base;
  color: $gray-900;
}

.radio-custom {
  display: none;
}

.radio-label-text {
  font-size: $font-size-base;
}

.radio-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
