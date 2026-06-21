import type { LyricVideoConfig } from '@lyricpulse/core'
import { brassClockworkProfile, ProfileTemplate } from './profile-template'

export function BrassClockwork({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={brassClockworkProfile} />
}
