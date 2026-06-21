import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, geologicRingsProfile } from './profile-template'

export function GeologicRings({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={geologicRingsProfile} />
}
