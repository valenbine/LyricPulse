import type { ComponentType } from 'react'
import { type LyricVideoConfig, type TemplateId } from '@lyricpulse/core'
import * as Templates from './templates'
import {
  builtInTemplateMetadata,
  type BuiltInTemplateMetadata
} from './template-metadata'

export type BuiltInTemplateRegistration = BuiltInTemplateMetadata & {
  component: ComponentType<{ config: LyricVideoConfig }>
}

const exportedTemplates = Templates as unknown as Record<
  TemplateId,
  ComponentType<{ config: LyricVideoConfig }>
>

export const builtInTemplateRegistry = builtInTemplateMetadata.map((entry) => ({
  ...entry,
  component: exportedTemplates[entry.id]
}))

const builtInTemplateMap = new Map<TemplateId, BuiltInTemplateRegistration>(
  builtInTemplateRegistry.map((registration) => [registration.id, registration])
)

export function getTemplateRegistration(templateId: TemplateId) {
  const registration = builtInTemplateMap.get(templateId)

  if (!registration) {
    throw new Error(`Unknown template registration: ${templateId}`)
  }

  return registration
}
