import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, mirageGasStationProfile } from './profile-template'

export function MirageGasStation({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={mirageGasStationProfile} />
}
