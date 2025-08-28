<template>
  <span
    :class="['base-icon', size]"
    role="img"
    :aria-label="ariaLabel"
    :aria-hidden="ariaHidden"
    v-bind="$attrs"
  >
    <slot>
      <component
        :is="iconComponent"
        v-if="iconComponent"
        aria-hidden="true"
        focusable="false"
      />
    </slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
    validator: (v: string) => [
      'small',
      'medium',
      'large',
    ].includes(v),
  },
  ariaLabel: String,
  ariaHidden: {
    type: Boolean,
    default: false,
  },
})

const icons = import.meta.glob('./*.vue', { eager: true })

const iconComponent = computed(() => {
  if (!props.name) return null
  const foundKey = Object.keys(icons).find((key) => {
    const fileName = key.replace(/^\.\/|\.vue$/g, '')
    return fileName.toLowerCase() === props.name.toLowerCase()
  })
  if (!foundKey) return null
  const module = icons[foundKey]
  return module && typeof module === 'object' && 'default' in module ? module.default : module
})
</script>

<style scoped lang="scss">
.base-icon {
  display: inline-flex;
  vertical-align: middle;
  line-height: 0;

  svg {
    display: block;
    width: 1em;
    height: 1em;
  }
}

.base-icon.small {
  font-size: 1rem;
}

.base-icon.medium {
  font-size: 1.5rem;
}

.base-icon.large {
  font-size: 2rem;
}
</style>
