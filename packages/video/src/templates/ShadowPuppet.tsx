import type { LyricVideoConfig } from '@lyricpulse/core'
import { shadowPuppetProfile, ProfileTemplate } from './profile-template'

export function ShadowPuppet({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={shadowPuppetProfile} />
}
