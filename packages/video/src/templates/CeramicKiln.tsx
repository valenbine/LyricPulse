import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, ceramicKilnProfile } from './profile-template'

export function CeramicKiln({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={ceramicKilnProfile} />
}
