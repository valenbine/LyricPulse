import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, metroCircuitProfile } from './profile-template'

export function MetroCircuit({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={metroCircuitProfile} />
}
