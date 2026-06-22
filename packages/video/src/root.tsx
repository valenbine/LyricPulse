import type { ComponentType } from 'react'
import { Composition } from 'remotion'
import { videoRatios } from '@lyricpulse/core'
import type { LyricVideoConfig, TemplateId, VideoRatio } from '@lyricpulse/core'
import { getCompositionId, getVideoDimensions } from './dimensions'
import { getDurationInFrames } from './helpers'
import { createTemplateConfig } from './sample-config'
import {
  builtInTemplateRegistry,
  getTemplateRegistration
} from './template-registry'

const fps = 24

const templateComponents = Object.fromEntries(
  builtInTemplateRegistry.map((registration) => [registration.id, registration.component])
) as Record<TemplateId, ComponentType<{ config: LyricVideoConfig }>>

export function RemotionRoot() {
  return (
    <>
      {builtInTemplateRegistry.flatMap(({ id: templateId }) =>
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
  return getTemplateRegistration(templateId).component
}

export function getCompositionDefinitions() {
  return builtInTemplateRegistry.flatMap(({ id: templateId }) =>
    videoRatios.map((ratio: VideoRatio) => ({
      id: getCompositionId(templateId, ratio),
      templateId,
      ratio,
      dimensions: getVideoDimensions(ratio)
    }))
  )
}
