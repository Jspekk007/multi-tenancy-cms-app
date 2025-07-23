<!--
  BaseSelect.vue
  - For dropdown/select input fields.
  - To be used for single and multi-select dropdowns.
-->
<template>
  <div
    class="base-select-wrapper"
    :class="[size, { disabled, error: !!error }]"
  >
    <label
      v-if="label"
      :for="selectId"
      class="select-label"
    >{{ label }}</label>
    <select
      v-if="multiple"
      :id="selectId"
      class="base-select"
      :multiple="multiple"
      :disabled="disabled"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      v-bind="$attrs"
      :value="modelValue"
      :size="Math.min(options.length, 6)"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <option
        v-if="placeholder && !multiple"
        disabled
        value=""
      >{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="(option as SelectOption).value"
        :value="(option as SelectOption).value"
      >
        {{ (option as SelectOption).label }}
      </option>
    </select>
    <select
      v-else
      :id="selectId"
      class="base-select"
      :multiple="multiple"
      :disabled="disabled"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error ? errorId : undefined"
      v-bind="$attrs"
      :value="modelValue"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <option
        v-if="placeholder && !multiple"
        disabled
        value=""
      >{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="(option as SelectOption).value"
        :value="(option as SelectOption).value"
      >
        {{ (option as SelectOption).label }}
      </option>
    </select>
    <span
      v-if="error"
      :id="errorId"
      class="select-error"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export type SelectOption = { label: string, value: string | number }
export type BaseSelectProps = {
  modelValue?: string | number | Array<string | number>
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  multiple?: boolean
}

defineProps({
  modelValue: [
    String,
    Number,
    Array,
  ],
  options: {
    type: Array,
    required: true,
  },
  label: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium',
    validator: (v: string) => [
      'small',
      'medium',
      'large',
    ].includes(v),
  },
  multiple: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const isFocused = ref(false)
const selectId = computed(() => `base-select-${Math.random().toString(36).slice(2, 10)}`)
const errorId = computed(() => `${selectId.value}-error`)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target.multiple) {
    const selected = Array.from(target.selectedOptions).map(opt => opt.value)
    emit('update:modelValue', selected)
  }
  else {
    emit('update:modelValue', target.value)
  }
}
</script>

<style lang="scss" scoped>
.base-select {
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

  &:disabled {
    background: $gray-100;
    color: $gray-500;
    cursor: not-allowed;
  }
}

.base-select[multiple] {
  min-height: 8rem;
  height: auto;
  padding: $spacing-2 $spacing-4;
  resize: vertical;
}

.base-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  width: 100%;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &.error .base-select {
    border-color: $color-danger;
    box-shadow: 0 0 0 2px rgba($color-danger, 0.1);
  }
}

.select-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-1;
}

.base-select-wrapper.small .base-select {
  font-size: $font-size-sm;
  padding: $spacing-2 $spacing-3;
}

.base-select-wrapper.medium .base-select {
  font-size: $font-size-base;
  padding: $spacing-3 $spacing-4;
}

.base-select-wrapper.large .base-select {
  font-size: $font-size-lg;
  padding: $spacing-4 $spacing-5;
}

.select-error {
  color: $color-danger;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
}
</style>
