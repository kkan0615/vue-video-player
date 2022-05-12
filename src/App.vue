<template>
  <div
    class="vue-video-player-root-container"
  >
    <!-- If video is exist -->
    <div
      v-if="videoSrc"
      class="vue-video-player-video-container"
    >
      <video
        ref="videoRef"
        class="vue-video-player-video"
      >
        <source
          :src="videoSrc"
          type="video/webm"
        >
      </video>
      <div
        class="vue-video-player-middle-button"
        @click="onClickPlayBtn"
      >
        play
      </div>
      <div
        class="vue-video-player-controller"
      >
        <div
          class="vue-video-player-controller-play-button"
          @click="onClickPlayBtn"
        >
          play
        </div>
      </div>
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

import { computed, ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  }
})

const videoRef = ref<HTMLVideoElement>()

/**
 * Real Src
 */
const videoSrc = computed(() => {
  return props.src
})

const onClickPlayBtn = () => {
  if (videoRef.value?.paused) {
    videoRef.value?.play()
  }
}

const onClickPauseBtn = () => {
  if (!videoRef.value?.paused) {
    videoRef.value?.pause()
  }
}

</script>
<style
  lang="scss"
>
@import "./styles";
</style>
