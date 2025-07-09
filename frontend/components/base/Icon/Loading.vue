<template>
  <svg
    viewBox="0 0 50 50"
    aria-hidden="true"
    focusable="false"
    class="spin"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      stroke-width="5"
      stroke-linecap="round"
      stroke-dasharray="31.4 31.4"
      stroke-dashoffset="0"
    />
  </svg>
</template>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
