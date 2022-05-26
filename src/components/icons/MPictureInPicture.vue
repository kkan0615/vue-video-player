<template>
  <svg
    class="primary-color-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :height="size"
    :width="size"
  >
    <path
      d="M0 0h24v24H0z"
      fill="none"
    /><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
  </svg>
</template>
<script lang="ts">
export default {
  name: 'MPictureInPictureIcon',
}
</script>
<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    required: false,
    default: 24,
  },
})
</script>