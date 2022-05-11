<template>
  <div
    class="vue-video-player-container"
  >
    <!-- If video is exist -->
    <div
      v-if="videoSrc"
    >
      video will be here
    </div>
    <!-- If video is not exist -->
    <div
      v-else
    >
      No video
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayer',
}
</script>
<script setup lang="ts">

import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: '',
  }
})

/**
 * Real Src
 */
const videoSrc = computed(() => {
  return props.src
})

</script>
<style
  lang="scss"
>
.vue-video-player-container {
  color: white;
  background-color: grey;
  height: 500px;
  width: 500px;
}
</style>
