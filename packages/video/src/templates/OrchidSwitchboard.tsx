import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, orchidSwitchboardProfile } from './profile-template'

export function OrchidSwitchboard({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={orchidSwitchboardProfile} />
}
