import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, billiardParlorProfile } from './profile-template'

export function BilliardParlor({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={billiardParlorProfile} />
}
