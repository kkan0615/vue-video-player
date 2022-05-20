export type VueVideoPlayerVideoStatus = 'stop' | 'play' | 'pause'

export type VueVideoPlayerVideo = Pick<HTMLSourceElement,
'src' | 'type'>
export type VueVideoPlayerSubtitle = Pick<HTMLTrackElement,
'src' | 'srclang' | 'default' | 'label' | 'kind'>

export const VueVideoPlayerDefaultPlaybackRateList = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]