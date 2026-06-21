import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, laserEngraverProfile } from './profile-template'

export function LaserEngraver({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={laserEngraverProfile} />
}
