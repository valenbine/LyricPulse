import type { LyricVideoConfig } from '@lyricpulse/core'
import { jellyfishGardenProfile, ProfileTemplate } from './profile-template'

export function JellyfishGarden({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={jellyfishGardenProfile} />
}
