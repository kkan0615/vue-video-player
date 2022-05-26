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
```
<script setup lang="ts">

import VueVideoPlayer from '@kkan0615/vue-video-player'
import '@kkan0615/vue-video-player/dist/style.css'

</script>
```

## Props
| Name             | Type          | Default | Description                  |
|------------------|---------------|---------|------------------------------|
| videoList        | array<Video>  | []      | Video list                   |
| height           | string        | 600px   | Video height                 |
| width            | string        | 600px   | Video width                  |
| initVolume       | number        | 100     | 0 to 100, first volume size  |
| initPlaybackRate | number        | 1       | 0 to 2, first volume size    |
| disable          | boolean       | false   | Disable to press any buttons |
|                  |               |         |                              |

## Slot
| Name                 | Description |
|----------------------|-------------|
| prependInnerMenu     |             |
| appendInnerMenu      |             |
| betweenPlayAndVolume |             |
|                      |             |

## Key event
| Key        | Description   |
|------------|---------------|
| space      | Play or pause |
| ArrowRight | move forward  |
| ArrowLeft  | move backward |
| ArrowUp    | volume up     |
| ArrowDown  | volume down   |
|            |               |

## Types

### Video
| Key     | Type   | Description   |
|---------|--------|---------------|
| src     | string |               |
| type    | string |               |
| label   | string |               |
| quality | number |               |

### Subtitle
| Key     | Type   | Description   |
|---------|--------|---------------|
| src     | string |               |
| type    | string |               |
| label   | string |               |
| quality | number |               |

### Object fit
contain – the video will be scaled to fit the container while preserving the aspect ratio, letterboxing will be present around the video
cover – the video is scaled to fill the container while preserving the aspect ratio, the video will be clipped
fill – the video is scaled to fill the container without preserving the aspect ratio, the video will be stretched
none – video is not resized

## Support me

## What we do next?
### Hide pip mode with following code
```
if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
```