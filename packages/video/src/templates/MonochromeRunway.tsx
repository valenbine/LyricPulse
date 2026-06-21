import type { LyricVideoConfig } from '@lyricpulse/core'
import { monochromeRunwayProfile, ProfileTemplate } from './profile-template'

export function MonochromeRunway({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={monochromeRunwayProfile} />
}
