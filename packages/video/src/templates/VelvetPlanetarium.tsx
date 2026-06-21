import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, velvetPlanetariumProfile } from './profile-template'

export function VelvetPlanetarium({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={velvetPlanetariumProfile} />
}
