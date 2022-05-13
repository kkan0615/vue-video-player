<template>
  <div
    class="vue-video-player-controller-button vue-video-player-controller-volume-controller"
  >
    <button>
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
import { computed } from 'vue'

const props = defineProps<{
  volume?: number
}>()


const formattedVolume = computed(() => props.volume ? props.volume * 100 : 0)

const emits = defineEmits<{
  (e: 'update:volume', newVolume: number): void
}>()

const silent = () => {
  emits('update:volume', 0)
}

const onInputRange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:volume', target.valueAsNumber / 100)
}

</script>