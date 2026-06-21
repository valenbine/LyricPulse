import type { LyricVideoConfig } from '@lyricpulse/core'
import { cloudAtlasProfile, ProfileTemplate } from './profile-template'

export function CloudAtlas({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={cloudAtlasProfile} />
}
