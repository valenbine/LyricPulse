import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, circuitCathedralProfile } from './profile-template'

export function CircuitCathedral({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={circuitCathedralProfile} />
}
