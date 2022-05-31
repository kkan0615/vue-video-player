import { createApp } from 'vue'
// import { DefineComponent,  ComputedOptions, ComponentOptionsMixin, MethodOptions } from 'vue'
import VueVideoPlayer from './App.vue'

if (import.meta.env.DEV) {
  createApp(VueVideoPlayer)
    .mount('#app')
}

export default VueVideoPlayer
