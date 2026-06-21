import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, circuitKimonoProfile } from './profile-template'

export function CircuitKimono({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={circuitKimonoProfile} />
}
