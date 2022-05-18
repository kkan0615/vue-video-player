<template>
  <div
    class="vue-video-player-controller-progress-bar-container"
  >
    <!-- Running progress bar -->
    <input
      :style="{
        background: backgroundRangeInput,
      }"
      type="range"
      :step="0.001"
      min="0"
      :max="duration"
      :value="currentTime"
      @input="onUpdateCurrentTime"
    >
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayerProgressBar',
}
</script>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 0,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
    required: true,
  },
})

const runningBarPercentage = computed(() => {
  return (props.currentTime / props.duration) * 100
})
const backgroundRangeInput = computed(() => {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vue-video-player-primary-color')
  const progressBarColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vue-video-player-progress-bar-background')
  return `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${runningBarPercentage.value}%, ${progressBarColor} ${runningBarPercentage.value}%, ${progressBarColor} 100%)`
})

const emits = defineEmits<{
  (e: 'update:currentTime', newTime: number): void
}>()

const onUpdateCurrentTime = (event: Event) => {
  const target = event.target as HTMLInputElement

  emits('update:currentTime', target.valueAsNumber)
}

</script>