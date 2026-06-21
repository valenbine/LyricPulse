import type { LyricVideoConfig } from '@lyricpulse/core'
import { swissGridProfile, ProfileTemplate } from './profile-template'

export function SwissGrid({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={swissGridProfile} />
}
