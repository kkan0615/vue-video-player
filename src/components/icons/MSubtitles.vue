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
    /><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
  </svg>
</template>
<script lang="ts">
export default {
  name: 'MSubtitlesIcon',
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