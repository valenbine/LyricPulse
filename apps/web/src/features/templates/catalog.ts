import type { TemplateId } from '@lyricpulse/core'
import { randomPosterTemplateIds } from '@lyricpulse/video'
export * from '../studio/studio-catalog'

export function isRandomPosterTemplate(templateId: TemplateId) {
  return randomPosterTemplateIds.some((id) => id === templateId)
}
