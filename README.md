# It's beta version!

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
| Name             | Type               | Default                                      | Description                  |
|------------------|--------------------|----------------------------------------------|------------------------------|
| videoList        | video[] (array)    | []                                           | Video list                   |
| height           | string             | 600px                                        | Video height                 |
| width            | string             | 600px                                        | Video width                  |
| poster           | string             | ''                                           | picture url before start     |
| loop             | boolean            | false                                        | Loop the video               |
| initVolume       | number             | 100                                          | 0 to 100, first volume size  |
| initPlaybackRate | number             | 1                                            | 0 to 2, first volume size    |
| videoObjectFit   | object-fit (style) | 1                                            | object fit style             |
| subtitleList     | Subtitle[] (array) | []                                           | Subtitle list                |
| disable          | boolean            | false                                        | Disable to press any buttons |
| playbackRateList | number[] (array)   | [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0] | Playback rate list           |
| labelList        | label[] (array)    | (Check the README.md)                        | label(i18n) list             |
| subtitleClass    | string             | ''                                           | subtilte class               |

### label list
```
{
  noVideo: 'No video',
  errorPlaying: 'Sorry there are some errors to play the video',
  speed: 'speed',
  subtitle: 'subtitle',
  noSubtitle: 'no subtitle',
  pictureInPicture: 'picture in picture',
  quality: 'quality',
```
Copy it and change the values

## Slot
| Name                  | Description                                                    |
|-----------------------|----------------------------------------------------------------|
| prependInnerMenu      | front of controller panel                                      |
| appendInnerMenu       | back controller panel                                          |
| betweenPlayAndVolume  | between play and volume button (usually for next video button) |
| prependSettingContend | front of setting content list item                             |
| appendSettingContend  | back of setting content list item                              |
| errorContainer        | Error container                                                |

## Key event
| Key        | Description   |
|------------|---------------|
| space      | Play or pause |
| ArrowRight | move forward  |
| ArrowLeft  | move backward |
| ArrowUp    | volume up     |
| ArrowDown  | volume down   |

### Note
The event is added at window

## Types

### Video
| Key     | Type    | Description         | Example                |
|---------|---------|---------------------|------------------------|
| src     | string  | url                 | https://www.sample.com |
| type    | string  | type of video       | video/mp4              |
| label   | string  | label               | label                  |
| quality | number  | quality             | 720px                  | 
| default | boolean | is it default video | true                   |

### Note
Please use url not from local directory

### Subtitle
| Key        | Type    | Description            | Example                |
|------------|---------|------------------------|------------------------|
| src        | string  | url                    | https://www.sample.com |
| srclang    | string  | language               | en                     |
| default    | boolean | is it default subtitle | true                   |
| label      | string  | label                  | label                  | 
| kind       | string  | mostly use subtitle    | subtitle               |

### Note
Please use url not from local directory

### Object fit
- contain – the video will be scaled to fit the container while preserving the aspect ratio, letterboxing will be present around the video
- cover – the video is scaled to fill the container while preserving the aspect ratio, the video will be clipped
- fill – the video is scaled to fill the container without preserving the aspect ratio, the video will be stretched
- none – video is not resized

## How to add more list item in setting menu

```vue
<template
  #prependSettingContend
>
  <li
      class="vue-video-player-drop-menu-content-list-item"
      @click="someFunc()"
  >
    <!--  icon part  -->
    <div
        class="vue-video-player-drop-menu-content-list-item--icon"
    >
      <m-picture-in-picture-icon
          :size="18"
      />
    </div>
    <!--  label part  -->
    <div
        class="vue-video-player-drop-menu-content-title-container--title"
    >
      some label
    </div>
  </li>
</template>
```
### Note
Sorry, We don't support to additional list item like quality and subtitle menu. <br>
We plan to update it later!

## Customizing
### Styles
```
@import '@kkan0615/vue-video-player/dist/style.css'
```

## Support me
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/youngjinkwak)

## What we do next?
### Hide pip mode with following code
```
if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
```
### Add loading panel
### Add Error message panel
