import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, velvetRopeProfile } from './profile-template'

export function VelvetRope({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={velvetRopeProfile} />
}
