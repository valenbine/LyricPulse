import type { LyricVideoConfig } from '@lyricpulse/core'
import { industrialFurnaceProfile, ProfileTemplate } from './profile-template'

export function IndustrialFurnace({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={industrialFurnaceProfile} />
}
