import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, bauhausBlocksProfile } from './profile-template'

export function BauhausBlocks({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={bauhausBlocksProfile} />
}
