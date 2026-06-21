import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, platformBroadcastProfile } from './profile-template'

export function PlatformBroadcast({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={platformBroadcastProfile} />
}
