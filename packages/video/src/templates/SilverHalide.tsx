import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, silverHalideProfile } from './profile-template'

export function SilverHalide({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={silverHalideProfile} />
}
