import { describe, expect, it } from 'vitest'
import { randomPosterShowsCover } from './random-lyric-settings'

describe('randomPosterShowsCover', () => {
  it('returns false for hidden-cover random poster templates', () => {
    expect(randomPosterShowsCover('OrbitWords')).toBe(false)
  })

  it('returns true for cover-driven random poster templates', () => {
    expect(randomPosterShowsCover('ScatterPoster')).toBe(true)
  })

  it('returns undefined for non-random-poster templates', () => {
    expect(randomPosterShowsCover('NeonLyric')).toBeUndefined()
  })
})
