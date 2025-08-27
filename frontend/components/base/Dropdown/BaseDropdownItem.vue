<template>
  <div
    class="dropdown-item"
    role="option"
    tabindex="-1"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  close?: () => void
  onSelect: () => void
}>()

const handleClick = () => {
  props.onSelect?.()
  props.close?.()
}
</script>

<style scoped lang="scss">
.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
