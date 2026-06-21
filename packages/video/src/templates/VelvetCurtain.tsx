import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, velvetCurtainProfile } from './profile-template'

export function VelvetCurtain({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={velvetCurtainProfile} />
}
