import type {
  EditableObjectId,
  TemplateLayoutBox,
  TemplateObjectSettings,
  TemplateTypography,
  TemplateId,
  VideoRatio
} from '@lyricpulse/core'

export const randomPosterEditableObjectIds = [
  'title',
  'artist',
  'cover',
  'lyrics',
  'activeLyric'
] as const satisfies EditableObjectId[]

export type RandomPosterEditableObjectId =
  (typeof randomPosterEditableObjectIds)[number]

export const randomPosterTemplateIds = [
  'LyricsCloud',
  'ScatterPoster',
  'OrbitWords',
  'CutoutRansom',
  'NeonGraffiti',
  'MagneticPoetry',
  'BrokenKaraoke',
  'StarfieldWhispers',
  'PolaroidStorm',
  'InkSplashWords',
  'TerminalScatter',
  'VelvetMargins',
  'PrismDrift',
  'StickerBombLyrics',
  'BlueprintAnnotations',
  'RadioStaticText',
  'GlassMosaicWords',
  'CarnivalSigns',
  'ShadowTypeCollage',
  'HeatmapLyrics',
  'NewspaperRain'
] as const satisfies readonly TemplateId[]

export function randomPosterShowsCover(templateId: TemplateId) {
  if (!randomPosterTemplateIds.some((id) => id === templateId)) {
    return undefined
  }

  return randomPosterMetaMap[templateId as (typeof randomPosterTemplateIds)[number]]
    ?.showCover ?? false
}

type ActivePosition = 'center' | 'top' | 'bottom' | 'left' | 'right'

type RandomPosterMeta = {
  activePosition: ActivePosition
  showCover: boolean
}

type RandomPosterDefaults = {
  layout: TemplateLayoutBox
  typography?: TemplateTypography
}

const randomPosterMetaMap: Record<
  (typeof randomPosterTemplateIds)[number],
  RandomPosterMeta
> = {
  LyricsCloud: { activePosition: 'center', showCover: false },
  ScatterPoster: { activePosition: 'center', showCover: true },
  OrbitWords: { activePosition: 'center', showCover: false },
  CutoutRansom: { activePosition: 'bottom', showCover: true },
  NeonGraffiti: { activePosition: 'left', showCover: false },
  MagneticPoetry: { activePosition: 'top', showCover: true },
  BrokenKaraoke: { activePosition: 'bottom', showCover: false },
  StarfieldWhispers: { activePosition: 'center', showCover: false },
  PolaroidStorm: { activePosition: 'right', showCover: true },
  InkSplashWords: { activePosition: 'center', showCover: false },
  TerminalScatter: { activePosition: 'left', showCover: false },
  VelvetMargins: { activePosition: 'right', showCover: true },
  PrismDrift: { activePosition: 'center', showCover: false },
  StickerBombLyrics: { activePosition: 'center', showCover: false },
  BlueprintAnnotations: { activePosition: 'top', showCover: false },
  RadioStaticText: { activePosition: 'bottom', showCover: false },
  GlassMosaicWords: { activePosition: 'right', showCover: true },
  CarnivalSigns: { activePosition: 'center', showCover: false },
  ShadowTypeCollage: { activePosition: 'left', showCover: false },
  HeatmapLyrics: { activePosition: 'bottom', showCover: false },
  NewspaperRain: { activePosition: 'top', showCover: false }
}

function getFieldBox(ratio: VideoRatio, position: ActivePosition) {
  if (ratio === '16:9') {
    if (position === 'left') return { x: 92, y: 148, width: 1160, height: 800 }
    if (position === 'right') return { x: 600, y: 148, width: 1220, height: 800 }
    return { x: 120, y: 140, width: 1680, height: 820 }
  }

  if (position === 'top') return { x: 72, y: 170, width: 936, height: 1420 }
  if (position === 'bottom') return { x: 72, y: 310, width: 936, height: 1420 }
  return { x: 70, y: 190, width: 940, height: 1500 }
}

function getActiveBox(ratio: VideoRatio, position: ActivePosition, fieldBox: TemplateLayoutBox) {
  const anchor = {
    center: { x: 0.5, y: 0.5 },
    top: { x: 0.5, y: 0.28 },
    bottom: { x: 0.5, y: 0.68 },
    left: { x: 0.34, y: 0.5 },
    right: { x: 0.62, y: 0.5 }
  }[position]
  const width = ratio === '16:9' ? Math.min(fieldBox.width * 0.84, 820) : Math.min(fieldBox.width * 0.84, 724)
  const height = ratio === '16:9' ? 188 : 236

  return {
    x: Math.round(fieldBox.x + fieldBox.width * anchor.x - width / 2),
    y: Math.round(fieldBox.y + fieldBox.height * anchor.y - height / 2),
    width: Math.round(width),
    height,
    scale: 1,
    opacity: 1,
    visible: true
  } satisfies TemplateLayoutBox
}

function getDefaults(
  templateId: TemplateId,
  ratio: VideoRatio
): Record<RandomPosterEditableObjectId, RandomPosterDefaults> {
  const meta = randomPosterMetaMap[templateId as (typeof randomPosterTemplateIds)[number]] ?? {
    activePosition: 'center',
    showCover: false
  }
  const fieldBox = getFieldBox(ratio, meta.activePosition)

  return {
    title: {
      layout: ratio === '16:9'
        ? { x: 82, y: 64, width: 880, height: 84, scale: 1, opacity: 1, visible: true }
        : { x: 62, y: 76, width: 760, height: 108, scale: 1, opacity: 1, visible: true },
      typography: ratio === '16:9'
        ? { fontSize: 42, lineHeight: 0.98, fontWeight: 950, letterSpacing: -0.055 }
        : { fontSize: 54, lineHeight: 0.98, fontWeight: 950, letterSpacing: -0.055 }
    },
    artist: {
      layout: ratio === '16:9'
        ? { x: 82, y: 120, width: 520, height: 42, scale: 1, opacity: 0.68, visible: true }
        : { x: 62, y: 142, width: 420, height: 52, scale: 1, opacity: 0.68, visible: true },
      typography: ratio === '16:9'
        ? { fontSize: 22, lineHeight: 1.08, fontWeight: 760 }
        : { fontSize: 28, lineHeight: 1.08, fontWeight: 760 }
    },
    cover: {
      layout: ratio === '16:9'
        ? { x: 1524, y: 704, width: 300, height: 300, scale: 1, opacity: 0.54, visible: meta.showCover }
        : { x: 628, y: 1450, width: 360, height: 360, scale: 1, opacity: 0.54, visible: meta.showCover }
    },
    lyrics: {
      layout: { ...fieldBox, scale: 1, opacity: 1, visible: true },
      typography: ratio === '16:9'
        ? { fontSize: 56, lineHeight: 1.02, fontWeight: 820, letterSpacing: -0.035 }
        : { fontSize: 66, lineHeight: 1.02, fontWeight: 820, letterSpacing: -0.035 }
    },
    activeLyric: {
      layout: getActiveBox(ratio, meta.activePosition, fieldBox),
      typography: ratio === '16:9'
        ? { fontSize: 102, lineHeight: 0.98, fontWeight: 980, letterSpacing: -0.065 }
        : { fontSize: 126, lineHeight: 0.98, fontWeight: 980, letterSpacing: -0.065 }
    }
  }
}

export function createRandomPosterObjectSettings(
  templateId: TemplateId,
  ratio: VideoRatio,
  objectId: RandomPosterEditableObjectId
): TemplateObjectSettings {
  const defaults = getDefaults(templateId, ratio)[objectId]

  return {
    id: objectId,
    layout: { ...defaults.layout },
    ...(defaults.typography ? { typography: { ...defaults.typography } } : {})
  }
}

export function getRandomPosterObjectSettings(
  templateId: TemplateId,
  ratio: VideoRatio,
  objectId: RandomPosterEditableObjectId,
  objects?: TemplateObjectSettings[]
): TemplateObjectSettings & { layout: TemplateLayoutBox } {
  const configured = objects?.find((object) => object.id === objectId)
  const defaults = createRandomPosterObjectSettings(templateId, ratio, objectId)
  const layout = { ...defaults.layout } as TemplateLayoutBox

  if (configured?.layout) {
    Object.assign(layout, configured.layout)
  }

  return {
    ...defaults,
    ...configured,
    layout,
    typography:
      defaults.typography || configured?.typography
        ? { ...defaults.typography, ...configured?.typography }
        : undefined
  }
}

export function getRandomPosterDefaultObjectSettings(
  templateId: TemplateId,
  ratio: VideoRatio,
  objectId: RandomPosterEditableObjectId
) {
  return getDefaults(templateId, ratio)[objectId]
}
