import type { ComponentType } from 'react'
import { Composition } from 'remotion'
import { templateIds, videoRatios } from '@lyricpulse/core'
import type { LyricVideoConfig, TemplateId, VideoRatio } from '@lyricpulse/core'
import { getCompositionId, getVideoDimensions } from './dimensions'
import { getDurationInFrames } from './helpers'
import { createTemplateConfig } from './sample-config'
import * as Templates from './templates'

const fps = 24

const exportedTemplates = Templates as unknown as Record<
  TemplateId,
  ComponentType<{ config: LyricVideoConfig }>
>

const templateComponents = Object.fromEntries(
  templateIds.map((templateId) => [templateId, exportedTemplates[templateId]])
) as Record<TemplateId, ComponentType<{ config: LyricVideoConfig }>>

export function RemotionRoot() {
  return (
    <>
      {templateIds.flatMap((templateId) =>
        videoRatios.map((ratio) => {
          const config = createTemplateConfig(templateId, ratio)
          const dimensions = getVideoDimensions(ratio)
          const Component = templateComponents[templateId]

          return (
            <Composition
              key={getCompositionId(templateId, ratio)}
              id={getCompositionId(templateId, ratio)}
              component={Component}
              durationInFrames={getDurationInFrames(config, fps)}
              fps={fps}
              width={dimensions.width}
              height={dimensions.height}
              defaultProps={{ config }}
            />
          )
        })
      )}
    </>
  )
}

export function getTemplateComponent(templateId: TemplateId) {
  return templateComponents[templateId]
}

export function getCompositionDefinitions() {
  return templateIds.flatMap((templateId) =>
    videoRatios.map((ratio: VideoRatio) => ({
      id: getCompositionId(templateId, ratio),
      templateId,
      ratio,
      dimensions: getVideoDimensions(ratio)
    }))
  )
}
