import {
  formatArtistDisplay,
  type EditableObjectId,
  type LyricVideoConfig,
  type TemplateDefinition,
  type TemplateId,
  type VideoRatio
} from '@lyricpulse/core'
import {
  createHeroSplitObjectSettings,
  createPulseCoverObjectSettings,
  createRandomPosterObjectSettings,
  getHeroSplitObjectSettings,
  getPulseCoverObjectSettings,
  getRandomPosterDefaultObjectSettings,
  getRandomPosterObjectSettings,
  heroSplitDefaultObjectSettings,
  heroSplitEditableObjectIds,
  pulseCoverDefaultObjectSettings,
  pulseCoverEditableObjectIds,
  randomPosterEditableObjectIds,
  type HeroSplitEditableObjectId,
  type PulseCoverEditableObjectId,
  type RandomPosterEditableObjectId
} from '@lyricpulse/video'
import {
  defaultArtistEnglishName,
  defaultArtistName,
  defaultSongTitle,
  defaultStageLighting,
  isRandomPosterTemplate,
  previewFallbackAnalysis,
  previewFallbackCoverUrl,
  previewFontStack,
  sampleLyrics
} from '../templates/catalog'

export const editableObjectLabels: Record<EditableObjectId, string> = {
  title: '歌名',
  artist: '歌手名',
  lyrics: '歌词',
  activeLyric: '当前句',
  cover: '封面',
  background: '背景',
  spectrum: '频谱'
}

export type TemplateEditorObjectId =
  | HeroSplitEditableObjectId
  | PulseCoverEditableObjectId
  | RandomPosterEditableObjectId

const templateEditorObjects = heroSplitEditableObjectIds
const legacyHeroSplitPortraitLyricsLayout = {
  x: 58,
  y: 820,
  width: 490,
  height: 520,
  fontSize: 82
}

export function getTemplateEditorObjects(templateId: TemplateId) {
  if (isRandomPosterTemplate(templateId)) {
    return randomPosterEditableObjectIds
  }

  return templateId === 'PulseCover' ? pulseCoverEditableObjectIds : templateEditorObjects
}

export function supportsObjectEditor(templateId: TemplateId) {
  return templateId === 'HeroSplit' || templateId === 'PulseCover' || isRandomPosterTemplate(templateId)
}

export function createTemplateDraft(templateId: TemplateId, ratio: VideoRatio): Partial<TemplateDefinition> {
  return {
    ratioSettings: {
      [ratio]: {
        objects: getTemplateEditorObjects(templateId).map((objectId) =>
          createTemplateObjectSettings(templateId, ratio, objectId)
        )
      }
    }
  }
}

export function createTemplateObjectSettings(
  templateId: TemplateId,
  ratio: VideoRatio,
  objectId: TemplateEditorObjectId
) {
  if (isRandomPosterTemplate(templateId)) {
    return createRandomPosterObjectSettings(
      templateId,
      ratio,
      objectId as RandomPosterEditableObjectId
    )
  }

  if (templateId === 'PulseCover') {
    return createPulseCoverObjectSettings(
      ratio,
      objectId as PulseCoverEditableObjectId
    )
  }

  return createHeroSplitObjectSettings(ratio, objectId as HeroSplitEditableObjectId)
}

export function getDefaultObjectSettings(
  templateId: TemplateId,
  ratio: VideoRatio,
  objectId: TemplateEditorObjectId
) {
  if (isRandomPosterTemplate(templateId)) {
    return getRandomPosterDefaultObjectSettings(
      templateId,
      ratio,
      objectId as RandomPosterEditableObjectId
    )
  }

  if (templateId === 'PulseCover') {
    return pulseCoverDefaultObjectSettings[ratio][
      objectId as PulseCoverEditableObjectId
    ]
  }

  return heroSplitDefaultObjectSettings[ratio][objectId as HeroSplitEditableObjectId]
}

export function getTemplateLyricsSettings(
  template: TemplateDefinition,
  ratio: VideoRatio
) {
  const settings = getTemplateObjectSettings(template, ratio, 'lyrics')

  if (ratio !== '9:16') {
    return settings
  }

  const layout = settings.layout
  const typography = settings.typography
  const usesLegacyPortraitDefaults =
    layout?.x === legacyHeroSplitPortraitLyricsLayout.x &&
    layout.y === legacyHeroSplitPortraitLyricsLayout.y &&
    layout.width === legacyHeroSplitPortraitLyricsLayout.width &&
    layout.height === legacyHeroSplitPortraitLyricsLayout.height &&
    typography?.fontSize === legacyHeroSplitPortraitLyricsLayout.fontSize

  if (!usesLegacyPortraitDefaults) {
    return settings
  }

  const defaults = heroSplitDefaultObjectSettings[ratio].lyrics

  return {
    ...settings,
    layout: {
      ...layout,
      y: defaults.layout.y,
      height: defaults.layout.height
    },
    typography: {
      ...typography,
      fontSize:
        defaults.typography?.fontSize ??
        legacyHeroSplitPortraitLyricsLayout.fontSize
    }
  }
}

export function getTemplateObjectSettings(
  template: TemplateDefinition,
  ratio: VideoRatio,
  objectId: TemplateEditorObjectId
) {
  if (isRandomPosterTemplate(template.baseTemplateId)) {
    return getRandomPosterObjectSettings(
      template.baseTemplateId,
      ratio,
      objectId as RandomPosterEditableObjectId,
      template.ratioSettings[ratio]?.objects
    )
  }

  if (template.baseTemplateId === 'PulseCover') {
    return getPulseCoverObjectSettings(
      ratio,
      objectId as PulseCoverEditableObjectId,
      template.ratioSettings[ratio]?.objects
    )
  }

  return getHeroSplitObjectSettings(
    ratio,
    objectId as HeroSplitEditableObjectId,
    template.ratioSettings[ratio]?.objects
  )
}

export function updateTemplateObjectSettings(
  template: TemplateDefinition,
  ratio: VideoRatio,
  objectId: TemplateEditorObjectId,
  input: {
    layout?: Partial<NonNullable<ReturnType<typeof createTemplateObjectSettings>['layout']>>
    typography?: Partial<
      NonNullable<ReturnType<typeof createTemplateObjectSettings>['typography']>
    >
  }
): TemplateDefinition {
  const current = getTemplateObjectSettings(template, ratio, objectId)
  const nextObject = {
    ...current,
    layout: { ...current.layout, ...input.layout },
    typography: { ...current.typography, ...input.typography }
  }
  const ratioSettings = template.ratioSettings[ratio] ?? { objects: [] }
  const objects = ratioSettings.objects.some((object) => object.id === objectId)
    ? ratioSettings.objects.map((object) =>
        object.id === objectId ? nextObject : object
      )
    : [...ratioSettings.objects, nextObject]

  return {
    ...template,
    ratioSettings: {
      ...template.ratioSettings,
      [ratio]: { objects }
    },
    updatedAt: new Date().toISOString()
  }
}

export function normalizeTemplateEditorObjects(
  template: TemplateDefinition,
  ratio: VideoRatio
): TemplateDefinition {
  const ratioSettings = template.ratioSettings[ratio] ?? { objects: [] }
  const editorObjects = getTemplateEditorObjects(template.baseTemplateId)
  const normalizedObjects = editorObjects.map((objectId) =>
    getTemplateObjectSettings(template, ratio, objectId)
  )
  const otherObjects = ratioSettings.objects.filter(
    (object) => !editorObjects.some((objectId) => object.id === objectId)
  )

  return {
    ...template,
    ratioSettings: {
      ...template.ratioSettings,
      [ratio]: { objects: [...otherObjects, ...normalizedObjects] }
    },
    updatedAt: new Date().toISOString()
  }
}

export function createTemplateInspectorPreviewConfig(
  template: TemplateDefinition,
  ratio: VideoRatio
): LyricVideoConfig {
  return {
    projectId: `admin-preview-${template.id}`,
    title: defaultSongTitle,
    artist: formatArtistDisplay(defaultArtistName, defaultArtistEnglishName),
    artistEnglish: defaultArtistEnglishName,
    audioAssetId: 'admin-preview-audio',
    coverAssetId: 'admin-preview-cover',
    ratio,
    templateId: template.baseTemplateId,
    coverUrl: previewFallbackCoverUrl,
    lyrics: sampleLyrics,
    analysis: previewFallbackAnalysis,
    theme: {
      primaryColor: '#F8FAFC',
      accentColor: '#A3E635',
      backgroundIntensity: 0.85,
      fontFamily: previewFontStack
    },
    effect: {
      lyricGlow: 0.8,
      pulseIntensity: 0.75,
      beatImpact: 0.7,
      stageLighting: defaultStageLighting
    },
    customTemplate: template
  }
}
