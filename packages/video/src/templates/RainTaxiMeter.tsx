import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, rainTaxiMeterProfile } from './profile-template'

export function RainTaxiMeter({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={rainTaxiMeterProfile} />
}
