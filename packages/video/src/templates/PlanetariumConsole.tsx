import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, planetariumConsoleProfile } from './profile-template'

export function PlanetariumConsole({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={planetariumConsoleProfile} />
}
