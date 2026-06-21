import type { LyricVideoConfig } from '@lyricpulse/core'
import { radioTowerProfile, ProfileTemplate } from './profile-template'

export function RadioTower({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={radioTowerProfile} />
}
