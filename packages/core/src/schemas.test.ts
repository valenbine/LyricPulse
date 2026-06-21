import { describe, expect, it } from 'vitest'
import {
  lyricVideoConfigSchema,
  renderJobRequestSchema,
  uploadMetadataSchema
} from './schemas'

const analysis = {
  duration: 120,
  bpm: 128,
  beats: [0.5, 1.25],
  frames: [
    {
      time: 0,
      rms: 0.2,
      loudness: -16,
      bass: 0.4,
      mid: 0.3,
      treble: 0.2
    }
  ]
}

const config = {
  projectId: 'project-1',
  ratio: '9:16',
  templateId: 'PulseCover',
  title: 'Song Title',
  artist: 'Artist',
  artistEnglish: 'ARTIST',
  audioAssetId: 'asset-audio',
  audioUrl: 'https://example.com/audio.mp3',
  coverAssetId: 'asset-cover',
  coverUrl: 'https://example.com/cover.jpg',
  lyrics: [
    {
      id: 'line-1',
      startTime: 0,
      text: 'First line'
    }
  ],
  analysis,
  theme: {
    primaryColor: '#ffffff',
    accentColor: '#8b5cf6',
    backgroundIntensity: 0.8,
    fontFamily: 'Inter'
  },
  effect: {
    lyricGlow: 0.7,
    pulseIntensity: 0.8,
    beatImpact: 0.6,
    stageLighting: 0.75
  }
}

describe('schemas', () => {
  it('validates upload metadata', () => {
    expect(
      uploadMetadataSchema.parse({
        kind: 'audio',
        filename: 'song.mp3',
        sizeBytes: 1024,
        mimeType: 'audio/mpeg'
      })
    ).toEqual({
      kind: 'audio',
      filename: 'song.mp3',
      sizeBytes: 1024,
      mimeType: 'audio/mpeg'
    })
  })

  it('validates lyric video config', () => {
    expect(lyricVideoConfigSchema.parse(config)).toEqual(config)
  })

  it('rejects unsupported template ids', () => {
    expect(() =>
      lyricVideoConfigSchema.parse({ ...config, templateId: 'Unknown' })
    ).toThrow()
  })

  it('validates render job requests', () => {
    expect(
      renderJobRequestSchema.parse({ projectId: 'project-1', config })
    ).toEqual({ projectId: 'project-1', config })
  })

  it('fills default stage lighting for legacy configs', () => {
    const parsed = lyricVideoConfigSchema.parse({
      ...config,
      effect: {
        lyricGlow: 0.7,
        pulseIntensity: 0.8,
        beatImpact: 0.6
      }
    })

    expect(parsed.effect.stageLighting).toBe(0.75)
  })
})
