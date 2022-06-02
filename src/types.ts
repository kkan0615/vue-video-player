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
  noVideo: string
  errorPlaying: string
  speed: string
  subtitle: string
  noSubtitle: string
  pictureInPicture: string
  quality: string
}

export const VueVideoPlayerDefaultLabels: VueVideoPlayerLabels = {
  noVideo: 'No video',
  errorPlaying: 'Sorry there are some errors to play the video',
  speed: 'speed',
  subtitle: 'subtitle',
  noSubtitle: 'no subtitle',
  pictureInPicture: 'pip',
  quality: 'quality',
}

export const VueVideoPlayerDefaultPlaybackRateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
