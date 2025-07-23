<template>
  <div
    ref="dropdownRef"
    class="dropdown"
  >
    <div
      ref="triggerRef"
      class="dropdown-trigger"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      role="button"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger"></slot>
    </div>
    <transition name="fade">
      <div
        v-if="isOpen"
        :id="menuId"
        ref="menuRef"
        class="dropdown-menu"
        role="listbox"
        tabindex="-1"
        @keydown="onMenuKeydown"
      >
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, unref } from 'vue'

const isOpen = ref<boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuId = `dropdown-menu-${Math.random().toString(36).slice(2, 10)}`
const focusedIndex = ref(-1)

const open = () => {
  isOpen.value = true
  nextTick(() => {
    menuRef.value?.focus()
  })
}
const close = () => {
  isOpen.value = false
}
const toggle = () => {
  if (unref(isOpen)) {
    close()
  }
  else {
    open()
  }
}

const onTriggerKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open()
  }
}

const focusOption = (index: number) => {
  const menu = menuRef.value
  if (!menu) return
  const items = Array.from(menu.querySelectorAll('[role="option"]')) as HTMLElement[]
  if (items.length === 0) return
  const clamped = Math.max(0, Math.min(index, items.length - 1))
  focusedIndex.value = clamped
  items[clamped].focus()
}

const emitSelect = (index: number) => {
  const menu = menuRef.value
  if (!menu) return
  const items = Array.from(menu.querySelectorAll('[role="option"]')) as HTMLElement[]
  if (items[index]) {
    items[index].click()
  }
}

const onMenuKeydown = (e: KeyboardEvent) => {
  const menu = menuRef.value
  if (!menu) return
  const items = Array.from(menu.querySelectorAll('[role="option"]')) as HTMLElement[]
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    triggerRef.value?.focus()
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusOption(focusedIndex.value + 1)
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusOption(focusedIndex.value - 1)
    return
  }
  if (e.key === 'Home') {
    e.preventDefault()
    focusOption(0)
    return
  }
  if (e.key === 'End') {
    e.preventDefault()
    focusOption(items.length - 1)
    return
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (focusedIndex.value >= 0 && focusedIndex.value < items.length) {
      emitSelect(focusedIndex.value)
    }
    return
  }
}

const onClickOutside = (e: MouseEvent) => {
  if (!dropdownRef.value?.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})

defineExpose({
  close: () => { isOpen.value = false },
})
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
  outline: none;
}

.dropdown-menu {
  position: absolute;
  z-index: 10;
  min-width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  outline: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
