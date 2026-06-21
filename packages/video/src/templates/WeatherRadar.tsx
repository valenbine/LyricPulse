import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, weatherRadarProfile } from './profile-template'

export function WeatherRadar({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={weatherRadarProfile} />
}
