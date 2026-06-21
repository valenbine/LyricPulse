import type {
  EditableObjectId,
  TemplateLayoutBox,
  TemplateObjectSettings,
  TemplateTypography,
  VideoRatio
} from '@lyricpulse/core'
import {
  heroSplitDefaultObjectSettings,
  type HeroSplitEditableObjectId
} from './hero-split-settings'

export const pulseCoverEditableObjectIds = [
  'title',
  'artist',
  'lyrics',
  'cover'
] as const satisfies EditableObjectId[]

export type PulseCoverEditableObjectId = (typeof pulseCoverEditableObjectIds)[number]

type PulseCoverObjectDefaults = {
  layout: TemplateLayoutBox
  typography?: TemplateTypography
}

export const pulseCoverDefaultObjectSettings: Record<VideoRatio, Record<PulseCoverEditableObjectId, PulseCoverObjectDefaults>> = {
  '16:9': {
    cover: {
      layout: { x: 150, y: 326, width: 430, height: 430, scale: 1, opacity: 1, visible: true }
    },
    title: {
      layout: { x: 690, y: 300, width: 760, height: 108, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 54, lineHeight: 1, fontWeight: 950, letterSpacing: -0.06 }
    },
    artist: {
      layout: { x: 690, y: 406, width: 760, height: 52, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 30, lineHeight: 1.1, fontWeight: 850, letterSpacing: -0.025 }
    },
    lyrics: {
      layout: { x: 660, y: 508, width: 920, height: 250, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 78, lineHeight: 1.04, fontWeight: 950, letterSpacing: -0.055 }
    }
  },
  '9:16': {
    cover: {
      layout: { x: 235, y: 250, width: 610, height: 610, scale: 1, opacity: 1, visible: true }
    },
    title: {
      layout: { x: 116, y: 964, width: 848, height: 96, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 72, lineHeight: 1, fontWeight: 950, letterSpacing: -0.06 }
    },
    artist: {
      layout: { x: 116, y: 1078, width: 848, height: 58, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 42, lineHeight: 1.1, fontWeight: 850, letterSpacing: -0.025 }
    },
    lyrics: {
      layout: { x: 86, y: 1200, width: 908, height: 300, scale: 1, opacity: 1, visible: true },
      typography: { fontSize: 92, lineHeight: 1.04, fontWeight: 950, letterSpacing: -0.055 }
    }
  }
}

export function createPulseCoverObjectSettings(
  ratio: VideoRatio,
  objectId: PulseCoverEditableObjectId
): TemplateObjectSettings {
  const defaults = pulseCoverDefaultObjectSettings[ratio][objectId]

  return {
    id: objectId,
    layout: { ...defaults.layout },
    ...(defaults.typography ? { typography: { ...defaults.typography } } : {})
  }
}

export function getPulseCoverObjectSettings(
  ratio: VideoRatio,
  objectId: PulseCoverEditableObjectId,
  objects?: TemplateObjectSettings[]
): TemplateObjectSettings & { layout: TemplateLayoutBox } {
  const stored = objects?.find((object) => object.id === objectId)
  const configured = isHeroSplitDefaultObject(ratio, objectId, stored) ? undefined : stored
  const defaults = createPulseCoverObjectSettings(ratio, objectId)
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

function isHeroSplitDefaultObject(
  ratio: VideoRatio,
  objectId: PulseCoverEditableObjectId,
  object?: TemplateObjectSettings
) {
  if (!object?.layout) {
    return false
  }

  const heroDefaults = heroSplitDefaultObjectSettings[ratio][objectId as HeroSplitEditableObjectId]

  return (
    object.layout.x === heroDefaults.layout.x &&
    object.layout.y === heroDefaults.layout.y &&
    object.layout.width === heroDefaults.layout.width &&
    object.layout.height === heroDefaults.layout.height &&
    object.typography?.fontSize === heroDefaults.typography?.fontSize
  )
}
