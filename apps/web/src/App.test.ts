import { describe, expect, it } from 'vitest'
import type { TemplateDefinition } from '@lyricpulse/core'
import {
  getTemplateObjectSettings,
  normalizeTemplateEditorObjects,
  updateTemplateObjectSettings,
} from './features/admin/template-editor-helpers'

function createTemplate(overrides: Partial<TemplateDefinition> = {}): TemplateDefinition {
  return {
    id: 'template-hero-split',
    name: 'Template Hero Split',
    description: 'test template',
    schemaVersion: '1.0',
    baseTemplateId: 'HeroSplit',
    ratioSettings: { '9:16': { objects: [] } },
    createdAt: '2026-06-18T00:00:00.000Z',
    updatedAt: '2026-06-18T00:00:00.000Z',
    sourceType: 'custom',
    ...overrides,
  }
}

describe('template editor helpers', () => {
  it('updates numeric layout and typography fields for selected objects', () => {
    const template = createTemplate()

    const updatedTemplate = updateTemplateObjectSettings(template, '9:16', 'lyrics', {
      layout: { x: 222, width: 640 },
      typography: { fontSize: 58 },
    })

    const lyrics = getTemplateObjectSettings(updatedTemplate, '9:16', 'lyrics')

    expect(lyrics.layout.x).toBe(222)
    expect(lyrics.layout.width).toBe(640)
    expect(lyrics.typography?.fontSize).toBe(58)
  })

  it('normalizes editor objects before save while preserving edited values', () => {
    const template = createTemplate({
      ratioSettings: {
        '9:16': {
          objects: [
            {
              id: 'lyrics',
              layout: { x: 240, y: 1030, width: 620, height: 320, visible: true },
              typography: { fontSize: 54, fontFamily: 'Test Sans' },
            },
          ],
        },
      },
    })

    const normalizedTemplate = normalizeTemplateEditorObjects(template, '9:16')
    const objectIds = normalizedTemplate.ratioSettings['9:16']?.objects.map((object) => object.id) ?? []
    const lyrics = getTemplateObjectSettings(normalizedTemplate, '9:16', 'lyrics')

    expect(objectIds).toHaveLength(4)
    expect(objectIds).toEqual(expect.arrayContaining(['title', 'artist', 'cover', 'lyrics']))
    expect(lyrics.layout.x).toBe(240)
    expect(lyrics.layout.width).toBe(620)
    expect(lyrics.typography?.fontFamily).toBe('Test Sans')
  })
})
