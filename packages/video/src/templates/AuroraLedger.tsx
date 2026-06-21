import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, auroraLedgerProfile } from './profile-template'

export function AuroraLedger({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={auroraLedgerProfile} />
}
