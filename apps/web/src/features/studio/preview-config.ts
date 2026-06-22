import {
  filterLyricsByArtistName,
  formatArtistDisplay,
  type AudioAnalysis,
  type LyricLine,
  type LyricVideoConfig,
  type Project,
  type TemplateDefinition,
  type TemplateId,
  type VideoRatio
} from '@lyricpulse/core'

export type PreviewThemeInput = {
  primary: string
  accent: string
}

export type BuildPreviewConfigInput = {
  project?: Project
  projectLyricsSource?: LyricLine[]
  ratio: VideoRatio
  templateId: TemplateId
  title: string
  artist?: string
  artistEnglish?: string
  theme: PreviewThemeInput
  stageLighting: number
  sampleLyrics: LyricLine[]
  previewFallbackCoverUrl: string
  previewFallbackAnalysis: AudioAnalysis
  previewFontStack: string
  selectedCustomTemplate?: TemplateDefinition
}

export function buildPreviewConfig(
  input: BuildPreviewConfigInput
): LyricVideoConfig {
  const effectiveArtist = input.project?.artist ?? input.artist
  const effectiveArtistEnglish =
    input.project?.artistEnglish ?? input.artistEnglish
  const filteredProjectLyrics = input.projectLyricsSource
    ? filterLyricsByArtistName(input.projectLyricsSource, effectiveArtist)
    : undefined
  const audioAsset = input.project?.assets.find((asset) => asset.kind === 'audio')
  const coverAsset = input.project?.assets.find((asset) => asset.kind === 'cover')

  return {
    projectId: input.project?.id ?? 'sample-preview',
    ratio: input.ratio,
    templateId: input.templateId,
    title: input.project?.title ?? input.title,
    artist: formatArtistDisplay(effectiveArtist, effectiveArtistEnglish),
    artistEnglish: effectiveArtistEnglish,
    audioAssetId: audioAsset?.id ?? 'preview-audio',
    audioUrl: audioAsset
      ? `/api/projects/${input.project?.id}/assets/${audioAsset.id}/preview-audio`
      : undefined,
    coverAssetId: coverAsset?.id ?? 'preview-cover',
    coverUrl: coverAsset
      ? `/api/projects/${input.project?.id}/assets/${coverAsset.id}`
      : input.previewFallbackCoverUrl,
    lyrics: input.project ? filteredProjectLyrics ?? [] : input.sampleLyrics,
    analysis: input.project?.analysis ?? input.previewFallbackAnalysis,
    theme: {
      primaryColor: input.theme.primary,
      accentColor: input.theme.accent,
      backgroundIntensity: 0.85,
      fontFamily: input.previewFontStack
    },
    effect: {
      lyricGlow: 0.8,
      pulseIntensity: 0.75,
      beatImpact: 0.7,
      stageLighting: input.stageLighting
    },
    ...(input.selectedCustomTemplate
      ? { customTemplate: input.selectedCustomTemplate }
      : {})
  }
}
