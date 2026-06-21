import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, neonRainveilProfile } from './profile-template'

export function NeonRainveil({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={neonRainveilProfile} />
}
