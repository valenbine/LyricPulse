import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, neonPawnshopProfile } from './profile-template'

export function NeonPawnshop({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={neonPawnshopProfile} />
}
