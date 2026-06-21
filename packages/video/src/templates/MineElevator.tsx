import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, mineElevatorProfile } from './profile-template'

export function MineElevator({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={mineElevatorProfile} />
}
