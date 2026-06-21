import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, crystalCaveProfile } from './profile-template'

export function CrystalCave({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={crystalCaveProfile} />
}
