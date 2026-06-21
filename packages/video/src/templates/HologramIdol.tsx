import type { LyricVideoConfig } from '@lyricpulse/core'
import { hologramIdolProfile, ProfileTemplate } from './profile-template'

export function HologramIdol({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={hologramIdolProfile} />
}
