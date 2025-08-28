<template>
  <div
    ref="triggerRef"
    class="dropdown-trigger"
    tabindex="0"
    role="button"
    :aria-haspopup="true"
    :aria-expanded="isOpen"
    :aria-controls="menuId"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <span class="label"><slot></slot></span>
    <span
      class="arrow"
      :class="{ open: isOpen }"
    >▼</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  triggerRef: HTMLElement | null
  toggle: () => void
  isOpen: boolean
  menuId: string
}>()
</script>

<style scoped lang="scss">
.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

.label {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  margin-left: 0.5rem;
  flex: 0 0 auto;
}

.dropdown-trigger:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
}
</style>
