<template>
  <svg
    class="primary-color-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :height="size"
    :width="size"
  >
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </svg>
</template>
<script lang="ts">
export default {
  name: 'MSettingIcon',
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