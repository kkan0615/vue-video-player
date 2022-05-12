# vue-video-player
video player made by vue component

## Download
### NPM
```shell
npm i @kkan0615/vue-video-player
```
### YARN
```shell
yarn add @kkan0615/vue-video-player
```

## How to use
### Global component
``` typescript
import VueVideoPlayer from '@kkan0615/vue-video-player'
import '@kkan0615/vue-video-player/dist/style.css'

const app = createApp(App)

app
  .component('VueVideoPlayer', VueVideoPlayer)
  .mount('#app')
```
### In component


## Props
| Name    | Type    | Default | Description                  |
|---------|---------|---------|------------------------------|
| src     | string  |         | Video Src                    |
| disable | boolean | false   | Disable to press any buttons |
|         |         |         |                              |

## Support me