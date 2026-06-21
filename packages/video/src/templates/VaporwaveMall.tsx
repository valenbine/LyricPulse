import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, vaporwaveMallProfile } from './profile-template'

export function VaporwaveMall({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={vaporwaveMallProfile} />
}
