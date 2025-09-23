<template>
  <div>
    <BaseButton
      type="button"
      variant="primary"
      @click="handleClick"
    >
      Click Me
    </BaseButton>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      window.alert('Button clicked!')
    },
  },
}
</script>
