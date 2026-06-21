import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, volcanicSeismographProfile } from './profile-template'

export function VolcanicSeismograph({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={volcanicSeismographProfile} />
}
