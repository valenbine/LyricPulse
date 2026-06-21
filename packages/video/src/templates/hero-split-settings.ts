import type {
  EditableObjectId,
  TemplateLayoutBox,
  TemplateObjectSettings,
  TemplateTypography,
  VideoRatio
} from '@lyricpulse/core'

export const heroSplitEditableObjectIds = [
  'title',
  'artist',
  'lyrics',
  'cover'
] as const satisfies EditableObjectId[]

export type HeroSplitEditableObjectId = (typeof heroSplitEditableObjectIds)[number]

export const heroSplitFrameInsets = {
  '16:9': { top: 64, right: 88, bottom: 64, left: 88, radius: 46 },
  '9:16': { top: 82, right: 46, bottom: 82, left: 46, radius: 58 }
} satisfies Record<VideoRatio, { top: number; right: number; bottom: number; left: number; radius: number }>

type HeroSplitObjectDefaults = {
  layout: TemplateLayoutBox
  typography?: TemplateTypography
}

export const heroSplitDefaultObjectSettings: Record<VideoRatio, Record<HeroSplitEditableObjectId, HeroSplitObjectDefaults>> = {
  '16:9': {
    title: {
      layout: { x: 64, y: 160, width: 780, height: 180, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 76, lineHeight: 0.94, fontWeight: 980, letterSpacing: -0.075 }
    },
    artist: {
      layout: { x: 64, y: 118, width: 520, height: 48, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 28, lineHeight: 1.08, fontWeight: 720 }
    },
    lyrics: {
      layout: { x: 64, y: 448, width: 690, height: 360, scale: 1, opacity: 1, visible: true },
      typography: {
        fontFamily: 'FangSong, STFangsong, FZYaoti, Noto Serif CJK SC, SimSun, serif',
        fontSize: 66,
        lineHeight: 1.12,
        fontWeight: 920,
        letterSpacing: -0.052
      }
    },
    cover: {
      layout: { x: 837, y: 0, width: 907, height: 952, scale: 1, opacity: 1, visible: true }
    }
  },
  '9:16': {
    title: {
      layout: { x: 58, y: 194, width: 600, height: 190, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 88, lineHeight: 0.94, fontWeight: 980, letterSpacing: -0.075 }
    },
    artist: {
      layout: { x: 58, y: 146, width: 430, height: 58, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 32, lineHeight: 1.08, fontWeight: 720 }
    },
    lyrics: {
      layout: { x: 58, y: 940, width: 490, height: 440, scale: 1, opacity: 1, visible: true },
      typography: {
        fontFamily: 'FangSong, STFangsong, FZYaoti, Noto Serif CJK SC, SimSun, serif',
        fontSize: 78,
        lineHeight: 1.12,
        fontWeight: 920,
        letterSpacing: -0.052
      }
    },
    cover: {
      layout: { x: 546, y: 350, width: 360, height: 360, scale: 1, opacity: 1, visible: true }
    }
  }
} satisfies Record<VideoRatio, Record<HeroSplitEditableObjectId, Omit<TemplateObjectSettings, 'id'>>>

export function createHeroSplitObjectSettings(
  ratio: VideoRatio,
  objectId: HeroSplitEditableObjectId
): TemplateObjectSettings {
  const defaults = heroSplitDefaultObjectSettings[ratio][objectId]

  return {
    id: objectId,
    layout: { ...defaults.layout },
    ...(defaults.typography ? { typography: { ...defaults.typography } } : {})
  }
}

export function getHeroSplitObjectSettings(
  ratio: VideoRatio,
  objectId: HeroSplitEditableObjectId,
  objects?: TemplateObjectSettings[]
): TemplateObjectSettings & { layout: TemplateLayoutBox } {
  const configured = objects?.find((object) => object.id === objectId)
  const defaults = createHeroSplitObjectSettings(ratio, objectId)
  const layout = { ...defaults.layout } as TemplateLayoutBox

  if (configured?.layout) {
    Object.assign(layout, configured.layout)
  }

  return {
    ...defaults,
    ...configured,
    layout,
    typography: defaults.typography || configured?.typography
      ? { ...defaults.typography, ...configured?.typography }
      : undefined
  }
}
