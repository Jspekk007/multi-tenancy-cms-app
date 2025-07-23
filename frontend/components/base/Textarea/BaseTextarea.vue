<!--
  BaseTextarea.vue
  - For multi-line text input fields.
-->
<template>
  <div
    class="base-textarea-wrapper"
    :class="[size, { disabled, error: !!error }]"
  >
    <label
      v-if="label"
      :for="textareaId"
      class="textarea-label"
    >{{ label }}</label>
    <textarea
      :id="textareaId"
      ref="textareaRef"
      class="base-textarea"
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
    ></textarea>
    <span
      v-if="error"
      :id="errorId"
      class="textarea-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export type BaseTextareaProps = {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
}

defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  readonly: Boolean,
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium',
    validator: (v: string) => [
      'small',
      'medium',
      'large',
    ].includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isFocused = ref(false)
const textareaId = computed(() => `base-textarea-${Math.random().toString(36).slice(2, 10)}`)
const errorId = computed(() => `${textareaId.value}-error`)

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.base-textarea {
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
  resize: vertical;

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

.base-textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &.error .base-textarea {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba($color-danger, 0.1);
  }
}

.textarea-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.base-textarea-wrapper.small .base-textarea {
  font-size: $font-size-sm;
  padding: $spacing-2 $spacing-3;
}

.base-textarea-wrapper.medium .base-textarea {
  font-size: $font-size-base;
  padding: $spacing-3 $spacing-4;
}

.base-textarea-wrapper.large .base-textarea {
  font-size: $font-size-lg;
  padding: $spacing-4 $spacing-5;
}

.textarea-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
