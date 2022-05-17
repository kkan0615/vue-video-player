<template>
  <div
    class="vue-video-player-drop-menu-container"
  >
    <div
      @click="toggleIsOpen"
    >
      <slot
        name="activator"
      />
    </div>
    <div
      v-if="isOpen"
      class="vue-video-player-drop-menu-content"
      @click="toggleIsOpen"
    >
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'VueVideoPlayerDropMenu',
}
</script>
<script setup lang="ts">
import { ref } from 'vue'

// const props = defineProps({
//   modelValue: {
//     type: Boolean,
//     required: false,
//     default: false,
//   }
// })

const isOpen = ref(false)

const toggleIsOpen = () => {
  isOpen.value = !isOpen.value
}
</script>