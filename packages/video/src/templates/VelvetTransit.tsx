import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, velvetTransitProfile } from './profile-template'

export function VelvetTransit({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={velvetTransitProfile} />
}
