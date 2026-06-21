import type { LyricVideoConfig } from '@lyricpulse/core'

export function isServerRender(config: LyricVideoConfig) {
  return !config.audioUrl
}
