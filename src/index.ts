import { createApp } from 'vue'
// import { DefineComponent,  ComputedOptions, ComponentOptionsMixin, MethodOptions } from 'vue'
import VueVideoPlayer from './App.vue'

createApp(VueVideoPlayer).mount('#app')

// export default {
//   install: (app: App, options: any) => {
//     app.component('VueVideoPlayer', VueVideoPlayer)
//   }
// }

export default VueVideoPlayer
/* eslint-disable @typescript-eslint/ban-types */

// type EmitEvents =
//     'play'
//     | 'stop'
//     | 'pause'
//     | 'update:volume'
//
// interface VueVideoPlayer {
//   uid?: string
//   name?: string
//   src?: string
// }
//
// interface PublicMethods extends MethodOptions {
//   playOrStop: () => void
// }
//
// declare const _default: DefineComponent<
// VueVideoPlayer,
// {},
// {},
// ComputedOptions,
// PublicMethods,
// ComponentOptionsMixin,
// ComponentOptionsMixin,
// EmitEvents[],
// EmitEvents,
// VueVideoPlayer
// >
//
// export default _default