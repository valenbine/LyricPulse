import {
  templateIds,
  videoRatios,
  type TemplateId,
  type VideoRatio
} from '@lyricpulse/core'
import { randomPosterShowsCover } from './templates/random-lyric-settings'

export type TemplateCoverMode = 'standard' | 'embedded' | 'hidden'
export type TemplateFamily = 'core' | 'poster'

export type BuiltInTemplateMetadata = {
  id: TemplateId
  family: TemplateFamily
  coverMode: TemplateCoverMode
  supportedRatios: readonly VideoRatio[]
}

export const builtInTemplateMetadata = templateIds.map((id) => {
  const posterCoverMode = randomPosterShowsCover(id)

  return {
    id,
    family: posterCoverMode === undefined ? 'core' : 'poster',
    coverMode:
      posterCoverMode === undefined
        ? 'standard'
        : posterCoverMode
          ? 'embedded'
          : 'hidden',
    supportedRatios: videoRatios
  } satisfies BuiltInTemplateMetadata
})

const builtInTemplateMetadataMap = new Map<TemplateId, BuiltInTemplateMetadata>(
  builtInTemplateMetadata.map((entry) => [entry.id, entry])
)

export function getTemplateMetadata(templateId: TemplateId) {
  const metadata = builtInTemplateMetadataMap.get(templateId)

  if (!metadata) {
    throw new Error(`Unknown template metadata: ${templateId}`)
  }

  return metadata
}
