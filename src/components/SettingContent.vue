<template>
  <div
    style="height: 100%;"
  >
    <div
      v-if="currentMenuIndex === 0"
      style="height: 100%;"
    >
      <ul>
        <li
          v-for="playbackRate in playbackRateList"
          :key="playbackRate"
          @click="changePlaybackRate(playbackRate)"
        >
          {{ playbackRate }}
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
import { VueVideoPlayerDefaultPlaybackRateList } from '@/types'

const props = defineProps({
  playbackRateList: {
    type: Array as PropType<number[]>,
    required: true,
    default: () => VueVideoPlayerDefaultPlaybackRateList,
  }
})

const emits = defineEmits<{
  (e: 'update:playbackRate', newPlaybackRate: number): void
}>()
const currentMenuIndex = ref(0)

const changePlaybackRate = (newPlaybackRate: number) => {
  emits('update:playbackRate', newPlaybackRate)
}
</script>