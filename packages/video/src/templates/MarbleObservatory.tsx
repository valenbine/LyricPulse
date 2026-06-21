import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, marbleObservatoryProfile } from './profile-template'

export function MarbleObservatory({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={marbleObservatoryProfile} />
}
