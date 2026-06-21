import type { LyricVideoConfig } from '@lyricpulse/core'
import { solarGreenhouseProfile, ProfileTemplate } from './profile-template'

export function SolarGreenhouse({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={solarGreenhouseProfile} />
}
