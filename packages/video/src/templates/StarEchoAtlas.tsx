import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, starEchoAtlasProfile } from './profile-template'

export function StarEchoAtlas({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={starEchoAtlasProfile} />
}
