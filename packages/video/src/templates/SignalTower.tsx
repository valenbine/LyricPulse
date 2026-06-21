import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, signalTowerProfile } from './profile-template'

export function SignalTower({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={signalTowerProfile} />
}
