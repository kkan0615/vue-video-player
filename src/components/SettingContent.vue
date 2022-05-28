<template>
  <div
    class="h-full"
  >
    <!-- Main menu -->
    <div
      v-show="currentMenuIndex === 0"
    >
      <ul
        class="vue-video-player-drop-menu-content-list"
      >
        <slot
          name="prependSettingContend"
        />
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeCurrentMenuIndex(1)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-speed-icon
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-title-container--title"
          >
            {{ labelList.speed }}
          </div>
        </li>
        <li
          v-if="subtitleList && !!subtitleList.length"
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeCurrentMenuIndex(2)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-subtitles-icon
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-title-container--title"
          >
            {{ labelList.subtitle }}
          </div>
        </li>
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="togglePictureInPicture"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-picture-in-picture-icon
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-title-container--title"
          >
            {{ labelList.pictureInPicture }}
          </div>
        </li>
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeCurrentMenuIndex(3)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-display-setting-icon
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-title-container--title"
          >
            {{ labelList.quality }}
          </div>
        </li>
        <slot
          name="appendSettingContend"
        />
      </ul>
    </div>
    <!-- Speed -->
    <div
      v-show="currentMenuIndex === 1"
      class="h-full"
    >
      <div
        class="vue-video-player-drop-menu-content-title-container"
      >
        <m-arrow-back-icon
          class="vue-video-player-drop-menu-content-title-container--icon"
          @click="changeCurrentMenuIndex(0)"
        />
        <div
          class="vue-video-player-drop-menu-content-title-container--title"
        >
          {{ labelList.speed }}
        </div>
      </div>
      <hr>
      <ul
        class="vue-video-player-drop-menu-content-list"
      >
        <li
          v-for="playbackRate in playbackRateList"
          :key="playbackRate"
          class="vue-video-player-drop-menu-content-list-item"
          @click="changePlaybackRate(playbackRate)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-check-icon
              v-if="currentPlaybackRate === playbackRate"
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-list-item--label"
          >
            {{ playbackRate }}
          </div>
        </li>
      </ul>
    </div>
    <!-- Subtitle -->
    <div
      v-if="subtitleList && !!subtitleList.length"
      v-show="currentMenuIndex === 2"
      class="h-full"
    >
      <div
        class="vue-video-player-drop-menu-content-title-container"
      >
        <m-arrow-back-icon
          class="vue-video-player-drop-menu-content-title-container--icon"
          @click="changeCurrentMenuIndex(0)"
        />
        <div
          class="vue-video-player-drop-menu-content-title-container--title"
        >
          {{ labelList.subtitle }}
        </div>
      </div>
      <hr>
      <ul
        class="vue-video-player-drop-menu-content-list"
      >
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeSubtitle(null)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-check-icon
              v-if="currentSubtitleIndex === -1"
              :size="16"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-list-item--label"
          >
            {{ labelList.noSubtitle }}
          </div>
        </li>
        <li
          v-for="(subtitle, index) in subtitleList"
          :key="`subtitle-${index}`"
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeSubtitle(subtitle)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-check-icon
              v-if="currentSubtitleIndex === index"
              :size="16"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-list-item--label"
          >
            {{ subtitle.label }}
          </div>
        </li>
      </ul>
    </div>
    <!-- quality -->
    <div
      v-show="currentMenuIndex === 3"
      class="h-full"
    >
      <div
        class="vue-video-player-drop-menu-content-title-container"
      >
        <m-arrow-back-icon
          class="vue-video-player-drop-menu-content-title-container--icon"
          @click="changeCurrentMenuIndex(0)"
        />
        <div
          class="vue-video-player-drop-menu-content-title-container--title"
        >
          {{ labelList.quality }}
        </div>
      </div>
      <hr>
      <ul
        class="vue-video-player-drop-menu-content-list"
      >
        <li
          v-for="videoQuality in videoQualityList"
          :key="videoQuality.realIndex"
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeQuality(videoQuality)"
        >
          <div
            class="vue-video-player-drop-menu-content-list-item--icon"
          >
            <m-check-icon
              v-if="currentVideoIndex === videoQuality.realIndex"
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-list-item--label"
          >
            {{ videoQuality.quality }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayerProgressBarSettingContent',
}
</script>
<script setup lang="ts">
import { computed, inject, PropType, ref } from 'vue'
import {
  VueVideoPlayerDefaultLabels,
  VueVideoPlayerDefaultPlaybackRateList,
  VueVideoPlayerLabels,
  VueVideoPlayerSubtitle, VueVideoPlayerVideo
} from '@/types'
import MArrowBackIcon from '../components/icons/MArrowBackIcon.vue'
import MCheckIcon from '../components/icons/MCheckIcon.vue'
import MSpeedIcon from '../components/icons/MSpeed.vue'
import MDisplaySettingIcon from '../components/icons/MDisplaySetting.vue'
import MSubtitlesIcon from '../components/icons/MSubtitles.vue'
import MPictureInPictureIcon from '../components/icons/MPictureInPicture.vue'

const props = defineProps({
  videoRef: {
    type: Object as PropType<HTMLVideoElement>,
    required: true,
    default: null,
  },
  videoList: {
    type: Array as PropType<VueVideoPlayerVideo[]>,
    required: true,
    default: () => [] as VueVideoPlayerVideo[]
  },
  labelList: {
    type: Object as PropType<VueVideoPlayerLabels>,
    required: true,
    default: () => VueVideoPlayerDefaultLabels,
  },
  playbackRateList: {
    type: Array as PropType<number[]>,
    required: true,
    default: () => VueVideoPlayerDefaultPlaybackRateList,
  },
  subtitleList: {
    type: Array as PropType<VueVideoPlayerSubtitle[]>,
    required: false,
    default: () => [] as VueVideoPlayerSubtitle[]
  },
  currentVideoIndex: {
    type: Number,
    required: true,
    default: -1,
  },
  currentPlaybackRate: {
    type: Number,
    required: true,
    default: 1,
  },
  currentSubtitleIndex: {
    type: Number,
    required: true,
    default: -1,
  },
})

const emits = defineEmits<{
  (e: 'update:playbackRate', newPlaybackRate: number): void
  (e: 'update:subtitle', subtitle: VueVideoPlayerSubtitle | null): void
  (e: 'update:quality', subtitle: VueVideoPlayerVideo): void
}>()

const changeIsOpen = inject('changeIsOpen') as (bool: boolean) => void

const currentMenuIndex = ref(0)

const videoQualityList = computed(() => {
  let result: (VueVideoPlayerVideo & {realIndex: number})[] = []
  if (props.videoList && props.videoList.length) {
    result = props.videoList.map((video, index) => {
      return { ...video, realIndex: index }
    }).filter((video) => !!video.quality)
  }

  return result
})

const changeCurrentMenuIndex = (index: number) => {
  currentMenuIndex.value = index
}

const changePlaybackRate = (newPlaybackRate: number) => {
  emits('update:playbackRate', newPlaybackRate)
}

const changeSubtitle = (subtitle: VueVideoPlayerSubtitle | null) => {
  emits('update:subtitle', subtitle)
}

const changeQuality = (video: VueVideoPlayerVideo) => {
  emits('update:quality', video)
}

const togglePictureInPicture = () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture()
    changeIsOpen(false)
  } else {
    if (document.pictureInPictureEnabled && props.videoRef) {
      props.videoRef.requestPictureInPicture()
      changeIsOpen(false)
    }
  }
}
</script>
