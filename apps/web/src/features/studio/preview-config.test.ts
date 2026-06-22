import { describe, expect, it } from 'vitest'
import type { Project, TemplateDefinition } from '@lyricpulse/core'
import { buildPreviewConfig } from './preview-config'

const previewFallbackAnalysis = {
  duration: 9,
  bpm: 120,
  beats: [0, 0.5],
  frames: [{ time: 0, rms: 0.4, loudness: -14, bass: 0.5, mid: 0.4, treble: 0.3 }]
}

const sampleLyrics = [
  { id: 'sample-1', startTime: 0, endTime: 1, text: 'Sample line' }
]

describe('buildPreviewConfig', () => {
  it('filters singer credit lines and preserves preview/export inputs', () => {
    const project: Project = {
      id: 'project-1',
      title: '真实歌名',
      artist: '歌手名字',
      artistEnglish: 'ARTIST',
      assets: [
        {
          id: 'audio-1',
          kind: 'audio',
          filename: 'song.mp3',
          format: 'mp3',
          sizeBytes: 128,
          storagePath: 'audio/song.mp3',
          createdAt: '2026-06-22T00:00:00.000Z'
        },
        {
          id: 'cover-1',
          kind: 'cover',
          filename: 'cover.jpg',
          format: 'jpg',
          sizeBytes: 64,
          storagePath: 'cover/cover.jpg',
          createdAt: '2026-06-22T00:00:00.000Z'
        }
      ],
      lyrics: [],
      analysis: previewFallbackAnalysis,
      createdAt: '2026-06-22T00:00:00.000Z',
      updatedAt: '2026-06-22T00:00:00.000Z',
      storageProvider: 'local',
      renderProvider: 'local'
    }
    const customTemplate = {
      id: 'template-1',
      name: 'Custom',
      schemaVersion: '1.0',
      baseTemplateId: 'HeroSplit',
      ratioSettings: { '9:16': { objects: [] } },
      sourceType: 'custom',
      createdAt: '2026-06-22T00:00:00.000Z',
      updatedAt: '2026-06-22T00:00:00.000Z'
    } satisfies TemplateDefinition

    const config = buildPreviewConfig({
      project,
      projectLyricsSource: [
        { id: 'credit', startTime: 0, endTime: 1, text: '歌手名字' },
        { id: 'line-1', startTime: 1, endTime: 2, text: '保留歌词' }
      ],
      ratio: '9:16',
      templateId: 'HeroSplit',
      title: '占位歌名',
      artist: '占位歌手',
      artistEnglish: 'PLACEHOLDER',
      theme: { primary: '#fff', accent: '#0f0' },
      stageLighting: 0.9,
      sampleLyrics,
      previewFallbackCoverUrl: 'https://example.com/fallback.jpg',
      previewFallbackAnalysis,
      previewFontStack: 'Noto Sans SC',
      selectedCustomTemplate: customTemplate
    })

    expect(config.title).toBe('真实歌名')
    expect(config.artist).toBe('歌手名字ARTIST')
    expect(config.audioUrl).toBe('/api/projects/project-1/assets/audio-1/preview-audio')
    expect(config.coverUrl).toBe('/api/projects/project-1/assets/cover-1')
    expect(config.lyrics.map((line) => line.text)).toEqual(['保留歌词'])
    expect(config.effect.stageLighting).toBe(0.9)
    expect(config.customTemplate?.id).toBe('template-1')
  })

  it('uses fallback preview assets when no project is loaded', () => {
    const config = buildPreviewConfig({
      ratio: '16:9',
      templateId: 'NeonLyric',
      title: '预览歌名',
      artist: '预览歌手',
      artistEnglish: 'PREVIEW',
      theme: { primary: '#111', accent: '#eee' },
      stageLighting: 0.75,
      sampleLyrics,
      previewFallbackCoverUrl: 'https://example.com/fallback.jpg',
      previewFallbackAnalysis,
      previewFontStack: 'Noto Sans SC'
    })

    expect(config.projectId).toBe('sample-preview')
    expect(config.coverUrl).toBe('https://example.com/fallback.jpg')
    expect(config.audioUrl).toBeUndefined()
    expect(config.lyrics).toEqual(sampleLyrics)
    expect(config.analysis).toEqual(previewFallbackAnalysis)
  })
})
