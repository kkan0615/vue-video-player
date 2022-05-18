<template>
  <div
    class="vue-video-player-root-container"
    :style="{
      height: isFullScreen ? '100vh' : height,
      width: isFullScreen ? '100vw' : width,
    }"
    @mouseover="displayMenu"
    @mousemove="displayMenu"
    @mouseleave="onMouseLeaveContainer"
  >
    <!-- If video is exist -->
    <div
      v-show="!!videoSrc"
      class="vue-video-player-video-container"
    >
      <video
        ref="videoRef"
        preload="metadata"
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
        <!--        <track-->
        <!--          label="test"-->
        <!--          kind="subtitles"-->
        <!--          srclang="en"-->
        <!--          src="./assets/sample.vtt"-->
        <!--          default-->
        <!--        >-->
      </video>
      <div
        class="vue-video-player-controller-container"
      >
        <div
          class="vue-video-player-middle-button-container"
          @click.stop="playOrPause"
        >
          <div
            class="vue-video-player-middle-button"
          >
            <m-play-icon
              v-if="videoStatus === 'stop' || videoStatus === 'pause'"
              :size="300"
            />
          </div>
        </div>
        <div
          v-show="(videoStatus === 'stop' || videoStatus === 'pause') || isDisplayMenu === true"
          class="vue-video-player-controller"
        >
          <!-- Progress bar -->
          <progress-bar
            :current-time="currentTime"
            :duration="duration"
            @update:currentTime="onUpdateCurrentTime"
          />
          <div
            class="vue-video-player-controller-menu"
          >
            <div
              class="vue-video-player-controller-button"
            >
              <button
                v-if="videoStatus === 'play'"
                @click="playOrPause"
              >
                <m-pause-icon />
              </button>
              <button
                v-else
                @click="playOrPause"
              >
                <m-play-icon />
              </button>
            </div>
            <volume-controller
              :volume="videoVolume"
              @update:volume="onUpdateVolume"
            />
            <!-- Timer -->
            <div
              class="vue-video-player-timer"
            >
              {{ formattedCurrentTime }} / {{ formattedDuration }}
            </div>
            <!-- Spacer -->
            <div
              style="margin: 0 auto;"
            />
            <div
              style="display: flex"
            >
              <div
                class="cursor-pointer"
                @click="toggleIsFullScreen"
              >
                <m-fullscreen-exit-icon
                  v-if="isFullScreen"
                />
                <m-fullscreen-icon
                  v-else
                />
              </div>

              <slot
                name="endController"
              >
                <drop-menu>
                  <template
                    #activator
                  >
                    <button>
                      <m-settings-icon />
                    </button>
                  </template>
                  <div>
                    test
                  </div>
                </drop-menu>
              </slot>
            </div>
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
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { VueVideoPlayerVideoStatus } from './types'
import VolumeController from './components/VolumeController.vue'
import DropMenu from './components/Dropmenu.vue'
import ProgressBar from './components/ProgressBar.vue'
import MPlayIcon from 'vue-material-design-icons/Play.vue'
import MPauseIcon from 'vue-material-design-icons/Pause.vue'
import MSettingsIcon from 'vue-material-design-icons/AccountSettings.vue'
import MFullscreenIcon from 'vue-material-design-icons/Fullscreen.vue'
import MFullscreenExitIcon from 'vue-material-design-icons/FullscreenExit.vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  height: {
    type: String,
    required: false,
    default: '400px'
  },
  width: {
    type: String,
    required: false,
    default: '1000px'
  },
  initVolume: {
    type: Number,
    required: false,
    default: 10,
  }
})

/* Ref for video html element */
const videoRef = ref<HTMLVideoElement>()
const videoStatus = ref<VueVideoPlayerVideoStatus>('stop')
const bufferBarPercentage = ref(50)
const duration = ref(0)
const currentTime = ref(0)
const timer = ref<NodeJS.Timer | null>(null)
const videoVolume = ref(0)
const isFullScreen = ref(false)
const isDisplayMenu = ref(true)
const menuTimer = ref<NodeJS.Timeout | null>(null)
/* Error message */
const errorMsg = ref('')

/**
 * Real Src
 */
const videoSrc = computed(() => {
  return props.src
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

  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  destroyTimer()

  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

/**
 * When the video is ready to run
 */
const onCanplay = () => {
  /* Set the duration */
  if (videoRef.value) {
    duration.value = videoRef.value?.duration || 0
    videoRef.value.volume = videoVolume.value
  }
  videoVolume.value = props.initVolume / 100
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

const moveForward = () => {
  if (videoRef.value) {
    if (videoRef.value.currentTime + 5 > videoRef.value.duration) {
      videoRef.value.currentTime = videoRef.value.duration
      currentTime.value = videoRef.value.duration
    } else {
      videoRef.value.currentTime += 5
      currentTime.value += 5
    }
    initMenuTimer()
  }
}

const moveBackward = () => {
  if (videoRef.value) {
    if (videoRef.value.currentTime - 5 <= 0) {
      videoRef.value.currentTime = 0
      currentTime.value = 0
    } else {
      videoRef.value.currentTime -= 5
      currentTime.value -= 5
    }
    initMenuTimer()
  }
}

const volumeUp = () => {
  const newVolume = parseFloat((videoVolume.value + 0.05).toFixed(2))
  if (newVolume <= 1) {
    onUpdateVolume(newVolume)
    initMenuTimer()
  } else if (newVolume >= 1) {
    onUpdateVolume(1)
    initMenuTimer()
  }
}

const volumeDown = () => {
  const newVolume = parseFloat((videoVolume.value - 0.05).toFixed(2))
  if (newVolume >= 0) {
    onUpdateVolume(newVolume)
    initMenuTimer()
  } else if (newVolume < 0) {
    onUpdateVolume(videoVolume.value - 0)
  }
}

const displayMenu = () => {
  isDisplayMenu.value = true
}

const onMouseLeaveContainer = () => {
  isDisplayMenu.value = false
}

const toggleIsFullScreen = () => {
  // @TODO: If there is no bug when publish, remove following comments
  // isFullScreen.value = !isFullScreen.value
  //
  // if (isFullScreen.value) {
  //   document.documentElement.requestFullscreen()
  // } else {
  //   document.exitFullscreen()
  // }
  if (!isFullScreen.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const onUpdateVolume = (newVolume: number) => {
  if (videoRef.value) {
    videoRef.value.volume = newVolume
    videoVolume.value = newVolume
  }
}

const onKeydown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'Space':
      playOrPause()
      break
    case 'ArrowRight':
      moveForward()
      break
    case 'ArrowLeft':
      moveBackward()
      break
    case 'ArrowUp':
      volumeUp()
      break
    case 'ArrowDown':
      volumeDown()
      break
  }
}

const onFullscreenChange = () => {
  const fs = document as any
  if (!fs.webkitIsFullScreen && !fs.mozFullScreen && !fs.msFullscreenElement) {
    isFullScreen.value = false
  } else {
    isFullScreen.value = true
  }
}

const onUpdateCurrentTime = (newCurrentTime: number) => {
  if (videoRef.value) {
    currentTime.value = newCurrentTime
    videoRef.value.currentTime = newCurrentTime
  }
}

const initTimer = () => {
  timer.value = setInterval(() => {
    currentTime.value = videoRef.value?.currentTime || 0
    if (videoRef.value && videoRef.value.currentTime > videoRef.value.duration) {
      destroyTimer()
    }
  }, 100)
}

const destroyTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const initMenuTimer = () => {
  destroyMenuTimer()
  isDisplayMenu.value = true
  menuTimer.value = setTimeout(() => {
    isDisplayMenu.value = false
    destroyMenuTimer()
  }, 3000)
}

const destroyMenuTimer = () => {
  if (menuTimer.value) {
    clearTimeout(menuTimer.value)
    menuTimer.value = null
  }
}

initTimer()


/**
 * Expose
 */
defineExpose({
  playOrPause,
})
</script>
<style
  lang="scss"
>
@import "./styles";
</style>
