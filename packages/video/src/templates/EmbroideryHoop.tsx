import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, embroideryHoopProfile } from './profile-template'

export function EmbroideryHoop({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={embroideryHoopProfile} />
}
