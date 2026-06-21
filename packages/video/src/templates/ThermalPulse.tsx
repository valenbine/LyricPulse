import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, thermalPulseProfile } from './profile-template'

export function ThermalPulse({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={thermalPulseProfile} />
}
