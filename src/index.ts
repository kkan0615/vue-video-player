import { App, createApp } from 'vue'
import VueVideoPlayer from './App.vue'

createApp(VueVideoPlayer).mount('#app')

export default {
  install: (app: App, options: any) => {
    app.component('VueVideoPlayer', VueVideoPlayer)
  }
}