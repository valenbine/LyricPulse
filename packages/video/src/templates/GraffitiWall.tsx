import type { LyricVideoConfig } from '@lyricpulse/core'
import { graffitiWallProfile, ProfileTemplate } from './profile-template'

export function GraffitiWall({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={graffitiWallProfile} />
}
