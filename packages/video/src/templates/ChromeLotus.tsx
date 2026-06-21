import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, chromeLotusProfile } from './profile-template'

export function ChromeLotus({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={chromeLotusProfile} />
}
