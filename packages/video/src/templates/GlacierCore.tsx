import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, glacierCoreProfile } from './profile-template'

export function GlacierCore({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={glacierCoreProfile} />
}
