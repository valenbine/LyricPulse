import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, departureFlipboardProfile } from './profile-template'

export function DepartureFlipboard({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={departureFlipboardProfile} />
}
