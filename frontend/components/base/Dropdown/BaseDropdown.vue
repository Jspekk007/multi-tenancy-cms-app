<template>
  <div
    class="dropdown"
    :class="{ 'is-open': isOpen }"
  >
    <!-- Trigger slot -->
    <slot
      name="trigger"
      :is-open="isOpen"
      :toggle="toggle"
      :trigger-ref="triggerRef"
      :menu-id="menuId"
    ></slot>

    <!-- Menu slot -->
    <transition name="fade">
      <slot
        v-if="isOpen"
        name="menu"
        :menu-ref="menuRef"
        :trigger-ref="triggerRef"
        :close="close"
        :focus-option="focusOption"
        :focused-index="focusedIndex"
        :menu-id="menuId"
      ></slot>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useDropdown } from '../../../composables/useDropdown'

const { isOpen, triggerRef, menuRef, toggle, close, focusOption, focusedIndex } = useDropdown()
const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;

  .dropdown-menu {
    position: absolute;
    z-index: 1000;
    background: white;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
    box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
    width: 100%; /* match trigger width */
    min-width: 0; /* prevent content from growing menu */
    box-sizing: border-box; /* include padding in width */
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
