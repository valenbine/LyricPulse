import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, lotusNeonProfile } from './profile-template'

export function LotusNeon({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={lotusNeonProfile} />
}
