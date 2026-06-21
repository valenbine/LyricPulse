import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, aeroInstrumentProfile } from './profile-template'

export function AeroInstrument({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={aeroInstrumentProfile} />
}
