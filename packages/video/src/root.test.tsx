import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { templateIds, videoRatios } from '@lyricpulse/core'
import { createTemplateConfig } from './sample-config'
import {
  getCompositionDefinitions,
  getTemplateComponent,
  RemotionRoot
} from './root'

describe('RemotionRoot', () => {
  it('exposes every template in both supported ratios', () => {
    const definitions = getCompositionDefinitions()

    expect(definitions).toHaveLength(templateIds.length * videoRatios.length)
    expect(definitions.map((definition) => definition.id)).toEqual([
      'PulseCover-9x16',
      'PulseCover-16x9',
      'NeonLyric-9x16',
      'NeonLyric-16x9',
      'WaveformStage-9x16',
      'WaveformStage-16x9'
    ])
  })

  it('creates a root React element', () => {
    expect(createElement(RemotionRoot).type).toBe(RemotionRoot)
  })

  it('creates template React elements with shared config contract', () => {
    templateIds.forEach((templateId) => {
      const Component = getTemplateComponent(templateId)
      const element = createElement(Component, {
        config: createTemplateConfig(templateId, '9:16')
      })

      expect(element.type).toBe(Component)
    })
  })
})
