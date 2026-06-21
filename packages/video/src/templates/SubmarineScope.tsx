import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, submarineScopeProfile } from './profile-template'

export function SubmarineScope({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={submarineScopeProfile} />
}
