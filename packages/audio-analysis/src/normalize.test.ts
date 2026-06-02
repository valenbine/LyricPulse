import { describe, expect, it } from 'vitest'
import { normalizeAudioAnalysis } from './normalize'

describe('normalizeAudioAnalysis', () => {
  it('creates fallback beats and frames for partial analysis', () => {
    const analysis = normalizeAudioAnalysis({ duration: 2, loudness: -18 })

    expect(analysis.duration).toBe(2)
    expect(analysis.beats.length).toBeGreaterThan(0)
    expect(analysis.frames.length).toBe(20)
    expect(analysis.unavailableFields).toEqual([
      'bpm',
      'beats',
      'frequencyBands'
    ])
  })

  it('uses safe defaults when all external analysis fails', () => {
    const analysis = normalizeAudioAnalysis({})

    expect(analysis.duration).toBe(1)
    expect(analysis.beats.length).toBeGreaterThan(0)
    expect(analysis.frames).toHaveLength(10)
    expect(analysis.unavailableFields).toEqual([
      'bpm',
      'beats',
      'loudness',
      'frequencyBands'
    ])
  })
})
