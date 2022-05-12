<template>
  <div
    class="vue-video-player-root-container"
  >
    <!-- If video is exist -->
    <div
      v-show="!!videoSrc"
      class="vue-video-player-video-container"
    >
      <video
        ref="videoRef"
        class="vue-video-player-video"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
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
          class="vue-video-player-controller-progress-bar-container"
        >
          <!-- Running progress bar -->
          <span
            :style="{
              width: `${runningBarPercentage}%`
            }"
            class="vue-video-player-controller-progress-bar-running"
          />
        </div>
        <div
          class="vue-video-player-controller-menu"
        >
          <div
            class="vue-video-player-controller-play-button"
            @click="playOrPause"
          >
            play
          </div>
        </div>
      </div>
    </div>
    <!-- Error message box -->
    <div
      v-if="errorMsg"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayer',
}
</script>
<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import { VueVideoPlayerVideoStatus } from './types'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  }
})

/* Ref for video html element */
const videoRef = ref<HTMLVideoElement>()
const videoStatus = ref<VueVideoPlayerVideoStatus>('stop')
const bufferBarPercentage = ref(50)
/* Error message */
const errorMsg = ref('')

/**
 * Real Src
 */
const videoSrc = computed(() => {
  return props.src
})

const runningBarPercentage = computed(() => {
  let result = 0
  if (videoRef.value?.currentTime && videoRef.value?.duration) {
    result = videoRef.value?.duration / videoRef.value?.currentTime * 100
  }

  return result
})

onMounted(() => {
  if (!props.src) {
    errorMsg.value = 'no video'
  }
})

const onPlay = () => {
  videoStatus.value = 'play'
}

const onPause = () => {
  videoStatus.value = 'pause'
}

const onEnded = () => {
  videoStatus.value = 'stop'

}

const playOrPause = () => {
  if (videoStatus.value === 'stop' || videoStatus.value === 'pause') {
    videoRef.value?.play()
  } else {
    videoRef.value?.pause()
  }
}

/**
 * Play the video
 */
const onClickPlayBtn = () => {
  if (videoRef.value?.paused) {
    videoRef.value?.play()
  }
}

/**
 * Pause the video
 */
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

#app {
  height: 90vh;
  width: 90vw;
}
</style>
