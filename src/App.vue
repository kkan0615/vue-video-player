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
      v-show="!!videoList.length"
      class="vue-video-player-video-container"
    >
      <video
        ref="videoRef"
        crossorigin="Access-Control-Allow-Origin: *"
        preload="metadata"
        class="vue-video-player-video"
        :style="{
          'object-fit': videoObjectFit,
        }"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @canplay="onCanplay"
      >
        <!-- Video -->
        <source
          v-for="(video, index) in videoList"
          :key="`video-${index}`"
          :src="video.src"
          :type="video.type"
        >
        <!-- Subtitle -->
        <track
          v-if="currentSubtitle"
          ref="videoTrackRef"
          mode="hidden"
          :label="currentSubtitle.label"
          :kind="currentSubtitle.kind"
          :srclang="currentSubtitle.srclang"
          :src="currentSubtitle.src"
          default
        >
      </video>
      <!-- Subtitle -->
      <div
        v-if="currentSubtitleCue"
        class="vue-video-player-subtitle-container"
        :style="{
          bottom: (videoStatus === 'stop' || videoStatus === 'pause') || isDisplayMenu === true ? '50px' : '25px'
        }"
      >
        <span
          :class="subtitleClass"
          class="vue-video-player-subtitle-container-subtitle"
        >
          {{ currentSubtitleCue }}
        </span>
      </div>
      <div
        class="vue-video-player-controller-container"
      >
        <!-- Middle button container -->
        <div
          class="vue-video-player-middle-button-container"
          @click="playOrPause"
        >
          <!-- Play button -->
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
            @update:current-time="onUpdateCurrentTime"
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
              <slot
                name="prependInnerMenu"
              />
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
              <!--              <div-->
              <!--                class="cursor-pointer"-->
              <!--                @click="onUpdateSubtitle(null)"-->
              <!--              >-->
              <!--                <m-subtitles-icon />-->
              <!--              </div>-->
              <drop-menu>
                <template
                  #activator
                >
                  <button>
                    <m-settings-icon />
                  </button>
                </template>
                <progress-bar-setting-content
                  :playback-rate-list="playbackRateList"
                  :subtitle-list="subtitleList"
                  :current-playback-rate="currentPlaybackRate"
                  :current-subtitle-index="currentSubtitleIndex"
                  @update:playback-rate="onUpdatePlaybackRate"
                  @update:subtitle="onUpdateSubtitle"
                />
              </drop-menu>
              <slot
                name="appendInnerMenu"
              />
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
import { computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import {
  VueVideoPlayerDefaultPlaybackRateList,
  VueVideoPlayerSubtitle,
  VueVideoPlayerVideo,
  VueVideoPlayerVideoStatus
} from './types'
import VolumeController from './components/VolumeController.vue'
import DropMenu from './components/Dropmenu.vue'
import ProgressBar from './components/ProgressBar.vue'
import ProgressBarSettingContent from '@/components/SettingContent.vue'
import MPlayIcon from 'vue-material-design-icons/Play.vue'
import MPauseIcon from 'vue-material-design-icons/Pause.vue'
import MSettingsIcon from 'vue-material-design-icons/AccountSettings.vue'
import MFullscreenIcon from 'vue-material-design-icons/Fullscreen.vue'
import MFullscreenExitIcon from 'vue-material-design-icons/FullscreenExit.vue'
import MSubtitlesIcon from 'vue-material-design-icons/Subtitles.vue'

const props = defineProps({
  videoList: {
    type: Array as PropType<VueVideoPlayerVideo[]>,
    required: true,
    default: () => [{
      // @TODO: Remove it when publish
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      // src: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.webm',
      type: 'video/webm',
    }]
  },
  height: {
    type: String,
    required: false,
    default: '600px'
  },
  width: {
    type: String,
    required: false,
    default: '1024px'
  },
  initVolume: {
    type: Number,
    required: false,
    default: 10,
  },
  initPlaybackRate: {
    type: Number,
    required: false,
    default: 1,
  },
  videoObjectFit: {
    type: String as PropType<'cover' | 'fill' | 'contain' | 'none'>,
    required: false,
    default: 'fill',
  },
  subtitleList: {
    type: Array as PropType<VueVideoPlayerSubtitle[]>,
    required: false,
    default: () => [
      // @TODO: Remove it when publish
      // {
      //   label: 'pt',
      //   kind: 'subtitles',
      //   srclang: 'pt',
      //   src: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt'
      // },
      {
        label: 'pt',
        kind: 'subtitles',
        srclang: 'pt',
        src: new URL('./assets/sample.vtt', import.meta.url) as any,
        default: false,
      },
      {
        label: 'en',
        kind: 'subtitles',
        srclang: 'en',
        src: new URL('./assets/sample2.vtt', import.meta.url) as any,
        default: true,
      }
    ] as VueVideoPlayerSubtitle[]
  },
  playbackRateList: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => VueVideoPlayerDefaultPlaybackRateList,
  },
  subtitleClass: {
    type: [Object, String],
    required: false,
    default: '',
  }
})

/* Ref for video html element */
const videoRef = ref<HTMLVideoElement>()
const videoTrackRef = ref<HTMLTrackElement>()
const videoStatus = ref<VueVideoPlayerVideoStatus>('stop')
const bufferBarPercentage = ref(50)
const duration = ref(0)
const currentTime = ref(0)
const timer = ref<NodeJS.Timer | null>(null)
const videoVolume = ref(0)
const isFullScreen = ref(false)
const isDisplayMenu = ref(true)
const menuTimer = ref<NodeJS.Timeout | null>(null)
const currentSubtitleCue = ref('')
/* Current playback rate */
const currentPlaybackRate = ref(1)
/* Current selected subtitle */
const currentSubtitleIndex = ref(-1)
/* Error message */
const errorMsg = ref('')

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

/**
 * Current subtitle (Track)
 */
const currentSubtitle = computed(() => {
  return props.subtitleList && props.subtitleList.length > 0 && currentSubtitleIndex.value >= 0
    ? props.subtitleList[currentSubtitleIndex.value]
    : null
})

onMounted(() => {
  if (!props.videoList || !props.videoList) {
    errorMsg.value = 'no video'
  }

  initDefaultSubtitle()
  initPlaybackRate()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  destroyTimer()

  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (videoRef.value) {
    videoRef.value.textTracks[0].removeEventListener('cuechange', onCueChange)
  }
})

/**
 * When the video is ready to run
 */
const onCanplay = () => {
  /* Set the duration */
  if (videoRef.value) {
    duration.value = videoRef.value?.duration || 0
    videoRef.value.volume = videoVolume.value
    videoRef.value.textTracks[0].addEventListener('cuechange', onCueChange)
  }
  videoVolume.value = props.initVolume / 100
}

const onCueChange = (event: Event) => {
  const currentTarget = event.currentTarget as TextTrack
  const cue = currentTarget.activeCues && currentTarget.activeCues.length > 0
    ? currentTarget.activeCues[0]
    : null
  if (cue) {
    currentSubtitleCue.value = (cue as VTTCue).text
  } else {
    currentSubtitleCue.value = ''
  }
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

/**
 * Key down event handler
 * @param event - keyboard event, look at the README.md
 */
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

const onUpdatePlaybackRate = (newPlaybackRate: number) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = newPlaybackRate
    currentPlaybackRate.value = newPlaybackRate
  }
}

const onUpdateSubtitle = (newSubtitle: VueVideoPlayerSubtitle | null) => {
  if (props.subtitleList && newSubtitle) {
    const findIndex = props.subtitleList.findIndex(subtitle => subtitle.label === newSubtitle.label)
    if (findIndex >= 0) {
      currentSubtitleIndex.value = findIndex
    }
  } else {
    currentSubtitleIndex.value = -1
  }
}

/**
 * Init subtitle
 */
const initDefaultSubtitle = () => {
  if (props.subtitleList) {
    const findIndex = props.subtitleList.findIndex(subtitle => subtitle.default)
    currentSubtitleIndex.value = findIndex >= 0 ? findIndex : -1
  } else {
    currentSubtitleIndex.value = -1
  }
}

const initPlaybackRate = () => {
  if (props.initPlaybackRate && videoRef.value) {
    onUpdatePlaybackRate(props.initPlaybackRate)
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
