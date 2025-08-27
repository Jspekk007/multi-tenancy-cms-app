import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export const useDropdown = () => {
  const isOpen = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const menuRef = ref<HTMLElement | null>(null)
  const focusedIndex = ref(-1)

  const open = () => {
    isOpen.value = true
    nextTick(() => menuRef.value?.focus())
  }

  const close = () => {
    isOpen.value = false
    focusedIndex.value = -1
  }

  const toggle = () => {
    isOpen.value ? close() : open()
  }

  const focusOption = (index: number) => {
    if (!menuRef.value) return
    const options = Array.from(menuRef.value.querySelectorAll('[role="option"]')) as HTMLElement[]
    if (!options.length) return

    const clamped = Math.max(0, Math.min(index, options.length - 1))
    focusedIndex.value = clamped
    options[clamped].focus()
  }

  const onClickOutside = (event: MouseEvent) => {
    if (!triggerRef.value || !menuRef.value) return
    if (!triggerRef.value.contains(event.target as Node)
      && !menuRef.value.contains(event.target as Node)) {
      close()
    }
  }

  onMounted(() => document.addEventListener('mousedown', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

  return {
    isOpen,
    triggerRef,
    menuRef,
    focusedIndex,
    open,
    close,
    toggle,
    focusOption,
  }
}
