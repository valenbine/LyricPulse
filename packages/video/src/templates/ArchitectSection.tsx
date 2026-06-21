import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, architectSectionProfile } from './profile-template'

export function ArchitectSection({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={architectSectionProfile} />
}
