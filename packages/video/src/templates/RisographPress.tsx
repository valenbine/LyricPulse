import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, risographPressProfile } from './profile-template'

export function RisographPress({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={risographPressProfile} />
}
