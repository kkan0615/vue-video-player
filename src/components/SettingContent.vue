<template>
  <div
    style="height: 100%;"
  >
    <!-- Main menu -->
    <div
      v-show="currentMenuIndex === 0"
    >
      <ul
        class="vue-video-player-drop-menu-content-list"
      >
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeCurrentMenuIndex(1)"
        >
          Speed
        </li>
        <li
          class="vue-video-player-drop-menu-content-list-item"
          @click="changeCurrentMenuIndex(2)"
        >
          Subtitle
        </li>
      </ul>
    </div>
    <!-- Speed -->
    <div
      v-show="currentMenuIndex === 1"
      style="height: 100%;"
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
          Speed
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
      v-show="currentMenuIndex === 2"
      style="height: 100%;"
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
          Subtitle
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
              :size="18"
            />
          </div>
          <div
            class="vue-video-player-drop-menu-content-list-item--label"
          >
            no subtitle
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
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayerProgressBarSettingContent',
}
</script>
<script setup lang="ts">
import { PropType, ref } from 'vue'
import { VueVideoPlayerDefaultPlaybackRateList, VueVideoPlayerSubtitle } from '@/types'
import MArrowBackIcon from '../components/icons/MArrowBackIcon.vue'
import MCheckIcon from '../components/icons/MCheckIcon.vue'

const props = defineProps({
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
}>()

const currentMenuIndex = ref(0)

const changeCurrentMenuIndex = (index: number) => {
  currentMenuIndex.value = index
}

const changePlaybackRate = (newPlaybackRate: number) => {
  emits('update:playbackRate', newPlaybackRate)
}

const changeSubtitle = (subtitle: VueVideoPlayerSubtitle | null) => {
  emits('update:subtitle', subtitle)
}
</script>