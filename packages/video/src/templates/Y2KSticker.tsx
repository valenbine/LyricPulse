import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, y2kStickerProfile } from './profile-template'

export function Y2KSticker({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={y2kStickerProfile} />
}
