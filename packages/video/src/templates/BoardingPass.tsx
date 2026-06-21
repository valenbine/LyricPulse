import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, boardingPassProfile } from './profile-template'

export function BoardingPass({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={boardingPassProfile} />
}
