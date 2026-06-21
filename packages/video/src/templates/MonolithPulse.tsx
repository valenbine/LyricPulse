import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, monolithPulseProfile } from './profile-template'

export function MonolithPulse({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={monolithPulseProfile} />
}
