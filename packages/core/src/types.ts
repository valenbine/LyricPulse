export const audioFormats = ['mp3', 'wav', 'flac', 'm4a'] as const
export const lyricFormats = ['lrc'] as const
export const coverFormats = ['jpg', 'jpeg', 'png', 'webp'] as const
export const videoRatios = ['9:16', '16:9'] as const
export const templateIds = ['PulseCover', 'NeonLyric', 'WaveformStage'] as const
export const renderJobStatuses = [
  'created',
  'analyzing',
  'rendering',
  'succeeded',
  'failed'
] as const

export type AudioFormat = (typeof audioFormats)[number]
export type LyricFormat = (typeof lyricFormats)[number]
export type CoverFormat = (typeof coverFormats)[number]
export type VideoRatio = (typeof videoRatios)[number]
export type TemplateId = (typeof templateIds)[number]
export type RenderJobStatus = (typeof renderJobStatuses)[number]

export type AssetKind = 'audio' | 'lyrics' | 'cover'
export type StorageProvider = 'local'
export type RenderProvider = 'local'

export type AssetMetadata = {
  id: string
  kind: AssetKind
  filename: string
  format: AudioFormat | LyricFormat | CoverFormat
  mimeType?: string
  sizeBytes: number
  storagePath: string
  createdAt: string
}

export type LyricLine = {
  id: string
  startTime: number
  endTime?: number
  text: string
}

export type LrcParseIssue = {
  lineNumber: number
  content: string
  message: string
}

export type LrcParseResult = {
  lines: LyricLine[]
  issues: LrcParseIssue[]
}

export type AudioAnalysisFrame = {
  time: number
  rms: number
  loudness: number
  bass: number
  mid: number
  treble: number
}

export type AudioAnalysis = {
  duration: number
  bpm?: number
  beats: number[]
  frames: AudioAnalysisFrame[]
  unavailableFields?: Array<'bpm' | 'beats' | 'loudness' | 'frequencyBands'>
}

export type LyricVideoTheme = {
  primaryColor: string
  accentColor: string
  backgroundIntensity: number
  fontFamily: string
}

export type LyricVideoEffect = {
  lyricGlow: number
  pulseIntensity: number
  beatImpact: number
}

export type LyricVideoConfig = {
  projectId: string
  ratio: VideoRatio
  templateId: TemplateId
  title?: string
  artist?: string
  audioAssetId: string
  coverAssetId: string
  lyrics: LyricLine[]
  analysis: AudioAnalysis
  theme: LyricVideoTheme
  effect: LyricVideoEffect
}

export type Project = {
  id: string
  title?: string
  artist?: string
  assets: AssetMetadata[]
  lyrics: LyricLine[]
  analysis?: AudioAnalysis
  config?: LyricVideoConfig
  storageProvider: StorageProvider
  renderProvider: RenderProvider
  createdAt: string
  updatedAt: string
}

export type RenderJob = {
  id: string
  projectId: string
  status: RenderJobStatus
  progress: number
  outputPath?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}
