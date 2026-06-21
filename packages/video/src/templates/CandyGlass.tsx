import type { LyricVideoConfig } from '@lyricpulse/core'
import { candyGlassProfile, ProfileTemplate } from './profile-template'

export function CandyGlass({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={candyGlassProfile} />
}
