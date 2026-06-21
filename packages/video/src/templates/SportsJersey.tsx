import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, sportsJerseyProfile } from './profile-template'

export function SportsJersey({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={sportsJerseyProfile} />
}
