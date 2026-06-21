import type { LyricVideoConfig } from '@lyricpulse/core'
import { zenGardenProfile, ProfileTemplate } from './profile-template'

export function ZenGarden({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={zenGardenProfile} />
}
