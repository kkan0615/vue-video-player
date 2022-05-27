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
        :src="currentVideo ? currentVideo.src : null"
        :loop="loop"
        class="vue-video-player-video"
        :style="{
          'object-fit': videoObjectFit,
        }"
        :poster="poster"
        @error="onErrorVideo"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @canplay="onCanplay"
      >
        <!-- Video -->
        <!--        <source-->
        <!--          v-for="(video, index) in videoList"-->
        <!--          :key="`video-${index}`"-->
        <!--          :src="video.src"-->
        <!--          :type="video.type"-->
        <!--        >-->
        <!--        <source-->
        <!--          v-if="currentVideo"-->
        <!--          :src="currentVideo.src"-->
        <!--          :type="currentVideoIndex.type"-->
        <!--        >-->
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
            @update:current-time="updateCurrentTime"
          />
          <div
            class="vue-video-player-controller-menu"
          >
            <slot
              name="prependInnerMenu"
            />
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
            <slot
              name="betweenPlayAndVolume"
            />
            <volume-controller
              :volume="videoVolume"
              @update:volume="updateVolume"
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
                style="margin-right: 4px;"
                @click="toggleIsFullScreen"
              >
                <m-fullscreen-exit-icon
                  v-if="isFullScreen"
                />
                <m-fullscreen-icon
                  v-else
                />
              </div>
              <!-- Caption button -->
              <div
                v-if="subtitleList && subtitleList.length > 0"
                class="cursor-pointer"
                style="margin-right: 4px;"
              >
                <m-closed-caption-icon
                  v-if="currentSubtitleIndex >= 0 && lastSubtitleIndex >= 0"
                  @click="toggleSubtitle(false)"
                />
                <m-closed-caption-off-icon
                  v-else
                  @click="toggleSubtitle(true)"
                />
              </div>
              <drop-menu>
                <template
                  #activator
                >
                  <m-settings-icon
                    class="cursor-pointer"
                  />
                </template>
                <progress-bar-setting-content
                  :video-ref="videoRef"
                  :video-list="videoList"
                  :label-list="labelList"
                  :playback-rate-list="playbackRateList"
                  :subtitle-list="subtitleList"
                  :current-video-index="currentVideoIndex"
                  :current-playback-rate="currentPlaybackRate"
                  :current-subtitle-index="currentSubtitleIndex"
                  @update:playback-rate="updatePlaybackRate"
                  @update:subtitle="updateSubtitle"
                  @update:quality="updateQuality"
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
import { computed, nextTick, onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import {
  ExtendSettingContent,
  VueVideoPlayerDefaultLabels,
  VueVideoPlayerDefaultPlaybackRateList, VueVideoPlayerLabels,
  VueVideoPlayerSubtitle,
  VueVideoPlayerVideo,
  VueVideoPlayerVideoStatus
} from './types'
import VolumeController from './components/VolumeController.vue'
import DropMenu from './components/Dropmenu.vue'
import ProgressBar from './components/ProgressBar.vue'
import ProgressBarSettingContent from '@/components/SettingContent.vue'
import MPlayIcon from './components/icons/MPlayArrowIcon.vue'
import MPauseIcon from './components/icons/MPauseIcon.vue'
import MSettingsIcon from './components/icons/MSettingIcon.vue'
import MFullscreenIcon from './components/icons/MFullScreenIcon.vue'
import MFullscreenExitIcon from './components/icons/MFullScreenExitIcon.vue'
import MClosedCaptionIcon from './components/icons/MClosedCaption.vue'
import MClosedCaptionOffIcon from './components/icons/MClosedCaptionOff.vue'

const props = defineProps({
  videoList: {
    type: Array as PropType<VueVideoPlayerVideo[]>,
    required: true,
    default: () =>
      [
        {
        // @TODO: Remove it when publish
          src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          // src: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.webm',
          type: 'video/mp4',
          label: '720px',
          quality: '720px',
          default: true,
        },
        {
          // @TODO: Remove it when publish
          // src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          src: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.webm',
          type: 'video/webm',
          quality: '480px'
        },

      ] as VueVideoPlayerVideo[]
  },
  height: {
    type: String,
    required: false,
    default: '600px',
  },
  width: {
    type: String,
    required: false,
    default: '1024px',
  },
  poster: {
    type: String,
    required: false,
    default: '',
  },
  loop: {
    type: Boolean,
    required: false,
    default: false,
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
  labelList: {
    type: Object as PropType<VueVideoPlayerLabels>,
    required: false,
    default: () => VueVideoPlayerDefaultLabels,
  },
  extendSettingContent: {
    type: Object as PropType<ExtendSettingContent>,
    required: false,
    default: () => []
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
const duration = ref(0)
const currentTime = ref(0)
const timer = ref<NodeJS.Timer | null>(null)
const videoVolume = ref(0)
const isFullScreen = ref(false)
const isDisplayMenu = ref(true)
const menuTimer = ref<NodeJS.Timeout | null>(null)
const currentVideoIndex = ref(-1)
const currentSubtitleCue = ref('')
/* Current playback rate */
const currentPlaybackRate = ref(1)
/* Current selected subtitle */
const currentSubtitleIndex = ref(-1)
const lastSubtitleIndex = ref(-1)
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
const currentVideo = computed(() => {
  return props.videoList && props.videoList.length > 0 && currentVideoIndex.value >= 0
    ? props.videoList[currentVideoIndex.value]
    : null
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
  initDefaultVideo()
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
    /* Init the volume */
    updateVolume(props.initVolume / 100)
    /* Init the track of text */
    if (videoRef.value.textTracks.length) {
      videoRef.value.textTracks[0].addEventListener('cuechange', onCueChange)
    }
  }
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

const playOrPause = async () => {
  if (videoRef.value) {
    try {
      if (videoStatus.value === 'stop' || videoStatus.value === 'pause') {
        await videoRef.value.play()
      } else {
        videoRef.value.pause()
      }
    } catch (e) {
      console.error(e)
      errorMsg.value = 'Cannot play the video'
    }
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
    updateVolume(newVolume)
    initMenuTimer()
  } else if (newVolume >= 1) {
    updateVolume(1)
    initMenuTimer()
  }
}

const volumeDown = () => {
  const newVolume = parseFloat((videoVolume.value - 0.05).toFixed(2))
  if (newVolume >= 0) {
    updateVolume(newVolume)
    initMenuTimer()
  } else if (newVolume < 0) {
    updateVolume(videoVolume.value - 0)
  }
}

const displayMenu = () => {
  isDisplayMenu.value = true
}

const onMouseLeaveContainer = () => {
  isDisplayMenu.value = false
}

const onErrorVideo = () => {
  errorMsg.value = 'Error!'
}

/**
 * Toggle full screen. <br>
 * If it's fullscreen, exit fullscreen mode, else enter fullscreen mode.
 */
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

/**
 * Change volume level
 * @param newVolume - volume level ( should be 0 to 1 )
 */
const updateVolume = (newVolume: number) => {
  if (videoRef.value && newVolume >= 0 && newVolume <= 1) {
    videoRef.value.volume = newVolume
    videoVolume.value = newVolume
  }
}

/**
 * Key down event handler <br>
 * Edit the README.md after event is added or removed.
 * @param event - keyboard event
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

/**
 * Fire this event when fullscreen mode is changed.
 */
const onFullscreenChange = () => {
  const fs = document as any
  if (!fs.webkitIsFullScreen && !fs.mozFullScreen && !fs.msFullscreenElement) {
    isFullScreen.value = false
  } else {
    isFullScreen.value = true
  }
}

/**
 * Update current time
 * @param newCurrentTime - new current time. should be in 0 to duration.
 */
const updateCurrentTime = (newCurrentTime: number) => {
  if (videoRef.value && newCurrentTime >= 0 && newCurrentTime <= duration.value) {
    currentTime.value = newCurrentTime
    videoRef.value.currentTime = newCurrentTime
  }
}

/**
 * Update playback rate (speed of video)
 * @param newPlaybackRate - new playback rate, should be greater than or equal to 0
 */
const updatePlaybackRate = (newPlaybackRate: number) => {
  if (videoRef.value && newPlaybackRate >= 0) {
    videoRef.value.playbackRate = newPlaybackRate
    currentPlaybackRate.value = newPlaybackRate
  }
}

/**
 * Update current subtitle
 * @param newSubtitle
 */
const updateSubtitle = (newSubtitle: VueVideoPlayerSubtitle | null) => {
  if (videoRef.value && videoRef.value.textTracks.length) {
    videoRef.value.textTracks[0].removeEventListener('cuechange', onCueChange)
  }
  if (props.subtitleList && newSubtitle) {
    const findIndex = props.subtitleList.findIndex(subtitle => subtitle.label === newSubtitle.label)
    if (findIndex >= 0) {
      currentSubtitleIndex.value = findIndex
      /* Add event */
      nextTick(() => {
        if (videoRef.value) {
          videoRef.value.textTracks[0].addEventListener('cuechange', onCueChange)
        }
      })
    }
  } else {
    currentSubtitleCue.value = ''
    currentSubtitleIndex.value = -1
  }
  lastSubtitleIndex.value = currentSubtitleIndex.value
}

const updateQuality = (newVideoQuality: VueVideoPlayerVideo) => {
  if (videoRef.value) {
    const findIndex = props.videoList.findIndex(video => video.quality === newVideoQuality.quality)
    if (findIndex >= 0) {
      currentVideoIndex.value = findIndex
    }

    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.currentTime = currentTime.value
        if (videoStatus.value === 'play')
          videoRef.value.play()
      }
    })
  }
}

const toggleSubtitle = (bool: boolean) => {
  const tempLastSubtitleIndex = lastSubtitleIndex.value >= 0 && props.subtitleList && props.subtitleList.length > 0
    ? lastSubtitleIndex.value : 0

  if (bool && props.subtitleList && props.subtitleList.length) {
    updateSubtitle(props.subtitleList[tempLastSubtitleIndex])
  } else {
    updateSubtitle(null)
  }
  lastSubtitleIndex.value = tempLastSubtitleIndex
}

const initDefaultVideo = () => {
  if (props.videoList) {
    const findIndex = props.videoList.findIndex(subtitle => !!subtitle.default)
    currentVideoIndex.value = findIndex >= 0 ? findIndex : -1
  } else {
    currentVideoIndex.value = -1
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
  lastSubtitleIndex.value = currentSubtitleIndex.value
}

const initPlaybackRate = () => {
  if (props.initPlaybackRate && videoRef.value) {
    updatePlaybackRate(props.initPlaybackRate)
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
