export type VueVideoPlayerVideoStatus = 'stop' | 'play' | 'pause'

export type VueVideoPlayerVideo = Pick<HTMLSourceElement,
'src' | 'type'> & {
  label: string
  quality?: string
  default?: boolean
}
export type VueVideoPlayerSubtitle = Pick<HTMLTrackElement,
'src' | 'srclang' | 'default' | 'label' | 'kind'>

export interface VueVideoPlayerLabels {
  speed: string
  subtitle: string
  noSubtitle: string
  pictureInPicture: string
  quality: string
}

export const VueVideoPlayerDefaultLabels: VueVideoPlayerLabels = {
  speed: 'speed',
  subtitle: 'subtitle',
  noSubtitle: 'no subtitle',
  pictureInPicture: 'picture in picture',
  quality: 'quality',
}

export const VueVideoPlayerDefaultPlaybackRateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
