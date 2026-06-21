import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, origamiSatelliteProfile } from './profile-template'

export function OrigamiSatellite({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={origamiSatelliteProfile} />
}
