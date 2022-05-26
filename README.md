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
| Name             | Type    | Default | Description                  |
|------------------|---------|---------|------------------------------|
| videoList        | Array   | []      | Video list                   |
| height           | String  | 600px   | Video height                 |
| width            | String  | 600px   | Video width                  |
| initVolume       | number  | 100     | 0 to 100, first volume size  |
| initPlaybackRate | number  | 1       | 0 to 2, first volume size    |
| disable          | boolean | false   | Disable to press any buttons |
|                  |         |         |                              |

## Slot
| Name             | Description |
|------------------|-------------|
| prependInnerMenu |             |
| appendInnerMenu  |             |
|                  |             |

## Key event
| Key        | Description   |
|------------|---------------|
| space      | Play or pause |
| ArrowRight | move forward  |
| ArrowLeft  | move backward |
| ArrowUp    | volume up     |
| ArrowDown  | volume down   |
|            |               |
## Support me