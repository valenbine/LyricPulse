import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, lowPolyIslandProfile } from './profile-template'

export function LowPolyIsland({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={lowPolyIslandProfile} />
}
