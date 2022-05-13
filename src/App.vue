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
        @canplay="onCanplay"
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
          <div>
            {{ formattedCurrentTime }} / {{ formattedDuration }}
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

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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
const duration = ref(0)
const currentTime = ref(0)
const timer = ref<NodeJS.Timer | null>(null)
/* Error message */
const errorMsg = ref('')

/**
 * Real Src
 */
const videoSrc = computed(() => {
  return props.src
})

const runningBarPercentage = computed(() => {
  return (currentTime.value / duration.value) * 100
})

const formattedDuration = computed(() => {
  const fixedSeconds = parseFloat(duration.value.toFixed(2))
  const minutes = parseInt((fixedSeconds / 60).toString())
  const seconds =  (parseInt((fixedSeconds % 60).toString()) || 0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const formattedCurrentTime = computed(() => {
  const fixedSeconds = parseFloat(currentTime.value.toFixed(2))
  const minutes = parseInt((fixedSeconds / 60).toString())
  const seconds =  (parseInt((fixedSeconds % 60).toString()) || 0).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

onMounted(() => {
  if (!props.src) {
    errorMsg.value = 'no video'
  }

})

onBeforeUnmount(() => {
  destroyTimer()
})

/**
 * When the video is ready to run
 */
const onCanplay = () => {
  /* Set the duration */
  duration.value = videoRef.value?.duration || 0
}

const onPlay = () => {
  if (!timer.value) {
    initTimer()
  }
  videoStatus.value = 'play'
}

const onPause = () => {
  destroyTimer()
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

const initTimer = () => {
  timer.value = setInterval(() => {
    currentTime.value = videoRef.value?.currentTime || 0
  }, 100)
}

const destroyTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

initTimer()

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
