import { describe, expect, it } from 'vitest'
import { getAnalysisFrame } from './helpers'

describe('getAnalysisFrame', () => {
  const frames = [
    { time: 0, rms: 0.1, loudness: -30, bass: 0.1, mid: 0.1, treble: 0.1 },
    { time: 1, rms: 0.2, loudness: -24, bass: 0.2, mid: 0.2, treble: 0.2 },
    { time: 2, rms: 0.3, loudness: -18, bass: 0.3, mid: 0.3, treble: 0.3 }
  ]

  it('returns the nearest frame with binary-search semantics', () => {
    expect(getAnalysisFrame(frames, 0.2)).toMatchObject({ time: 0 })
    expect(getAnalysisFrame(frames, 1.8)).toMatchObject({ time: 2 })
  })

  it('keeps the earlier frame on equal distance', () => {
    expect(getAnalysisFrame(frames, 0.5)).toMatchObject({ time: 0 })
    expect(getAnalysisFrame(frames, 1.5)).toMatchObject({ time: 1 })
  })
})
