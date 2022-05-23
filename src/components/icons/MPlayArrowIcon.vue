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
    /><path d="M8 5v14l11-7z" />
  </svg>
</template>
<script lang="ts">
export default {
  name: 'MPlayArrowIcon',
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