import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, forensicDarkroomProfile } from './profile-template'

export function ForensicDarkroom({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={forensicDarkroomProfile} />
}
