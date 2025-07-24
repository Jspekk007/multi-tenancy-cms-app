<template>
  <component
    :is="tag"
    :type="isButton ? type : undefined"
    :href="isLink ? href : undefined"
    :aria-label="ariaLabel"
    :aria-busy="loading || undefined"
    :aria-disabled="loading || disabled || undefined"
    :disabled="isButton && (disabled || loading) ? true : undefined"
    :class="[
      'base-button',
      variant,
      size,
      {
        'icon-only': iconOnly,
        loading,
        disabled,
      },
    ]"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <span
      class="button-content"
      :style="{ visibility: loading ? 'hidden' : 'visible' }"
    >
      <slot name="icon-left"></slot>
      <slot></slot>
      <slot name="icon-right"></slot>
    </span>
    <span
      v-if="loading"
      class="loader"
      aria-hidden="true"
    ></span>
  </component>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { oneOf } from '../../../utils/validators'

const _emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const props = defineProps({
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'danger'>,
    default: 'primary',
    validator: oneOf([
      'primary',
      'secondary',
      'danger',
    ]),
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
    validator: oneOf([
      'button',
      'submit',
      'reset',
    ]),
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
    validator: oneOf([
      'small',
      'medium',
      'large',
    ]),
  },
  href: String,
  iconOnly: Boolean,
  loading: Boolean,
  disabled: Boolean,
  ariaLabel: String,
})

const isLink = computed(() => !!props.href)
const isButton = computed(() => !props.href)
const tag = computed(() => (props.href ? 'a' : 'button'))
</script>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  position: relative;
  height: 3rem; /* fix height to prevent jump */

  &.loading {
    cursor: wait;
    pointer-events: none;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }

  &.icon-only {
    justify-content: center;

    .button-content > :not(svg, img) {
      display: none;
    }
  }

  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: opacity 0.2s ease;
  }

  .loader {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid transparent;
    border-top-color: currentcolor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* Size modifiers */
  &.small {
    padding: 0 1rem;
    font-size: 0.875rem;
  }

  &.medium {
    padding: 0 1.5rem;
    font-size: 1rem;
  }

  &.large {
    padding: 0 2.5rem;
    font-size: 1.125rem;
  }

  /* Variants */
  &.primary {
    background-color: #1e40af;
    color: #fff;

    &:hover:not(.disabled, .loading) {
      background-color: #1d4ed8;
    }
  }

  &.secondary {
    background-color: #e5e7eb;
    color: #111;

    &:hover:not(.disabled, .loading) {
      background-color: #d1d5db;
    }
  }

  &.danger {
    background-color: #dc2626;
    color: #fff;

    &:hover:not(.disabled, .loading) {
      background-color: #b91c1c;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
