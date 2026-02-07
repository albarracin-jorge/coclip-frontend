export interface CompressionSettings {
  crf: number
  preset: string
  width: number
  fps: number
  audioBitrate: string
  videoCodec: string
  audioCodec: string
}

export const DEFAULT_SETTINGS: CompressionSettings = {
  crf: 30,
  preset: 'slow',
  width: 854,
  fps: 24,
  audioBitrate: '96k',
  videoCodec: 'libx264',
  audioCodec: 'aac',
}

export const PRESETS = [
  'ultrafast',
  'superfast',
  'veryfast',
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow',
]

export const RESOLUTIONS = [
  { label: '480p (854px)', value: 854 },
  { label: '720p (1280px)', value: 1280 },
  { label: '1080p (1920px)', value: 1920 },
  { label: '1440p (2560px)', value: 2560 },
  { label: '4K (3840px)', value: 3840 },
]

export const AUDIO_BITRATES = ['64k', '96k', '128k', '192k', '256k', '320k']
