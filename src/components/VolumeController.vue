<template>
  <div
    class="vue-video-player-controller-button vue-video-player-controller-volume-controller"
  >
    <button
      @click="silentOrBack"
    >
      <m-volume-off
        v-if="volume === 0"
      />
      <m-volume-low
        v-else-if="volume > 0 && volume < 0.5"
      />
      <m-volume-high
        v-else-if="volume >= 0.5"
      />
    </button>
    <div
      class="vue-video-player-controller-volume-controller--slider-container"
    >
      <input
        :style="{
          background: backgroundRangeInput,
        }"
        min="0"
        max="100"
        :value="formattedVolume"
        class="vue-video-player-controller-volume-controller--slider"
        type="range"
        @input="onInputRange"
      >
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayerVolumeController',
}
</script>
<script setup lang="ts">
import MVolumeOff from 'vue-material-design-icons/VolumeOff.vue'
import MVolumeLow from 'vue-material-design-icons/VolumeLow.vue'
import MVolumeHigh from 'vue-material-design-icons/VolumeHigh.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  volume?: number
}>()

const emits = defineEmits<{
  (e: 'update:volume', newVolume: number): void
}>()

const lastVolume = ref(0)

const formattedVolume = computed(() => props.volume ? props.volume * 100 : 0)
const backgroundRangeInput = computed(() => {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vue-video-player-primary-color')
  const progressBarColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vue-video-player-progress-bar-background')
  return `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${formattedVolume.value}%, ${progressBarColor} ${formattedVolume.value}%, ${progressBarColor} 100%)`
})

const silentOrBack = () => {
  if (!props.volume) {
    if (!lastVolume.value)
      lastVolume.value = 100
    emits('update:volume', lastVolume.value / 100)
  } else {
    emits('update:volume', 0)
  }
}

const onInputRange = (event: Event) => {
  const target = event.target as HTMLInputElement
  lastVolume.value = target.valueAsNumber

  emits('update:volume', target.valueAsNumber / 100)
}

</script>