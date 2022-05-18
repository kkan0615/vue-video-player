<template>
  <div
    ref="containerRef"
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
import { onBeforeMount, ref } from 'vue'

const containerRef = ref<HTMLDivElement>()

// const props = defineProps({
//   modelValue: {
//     type: Boolean,
//     required: false,
//     default: false,
//   }
// })

onBeforeMount(() => {
  window.addEventListener('click', clickInEl)
})

const isOpen = ref(false)

const toggleIsOpen = () => {
  isOpen.value = !isOpen.value
}

const clickInEl = (e: any) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}
</script>