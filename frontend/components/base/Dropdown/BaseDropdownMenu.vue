<template>
  <div
    ref="menuRef"
    class="dropdown-menu"
    :style="{ minWidth: `${triggerRef?.offsetWidth || 0}px` }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  menuRef: HTMLElement | null
  triggerRef?: HTMLElement | null
}>()
</script>

<style scoped lang="scss">
.dropdown-menu {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
}
</style>
