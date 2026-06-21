import type { LyricVideoConfig } from '@lyricpulse/core'
import { lavaLampProfile, ProfileTemplate } from './profile-template'

export function LavaLamp({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={lavaLampProfile} />
}
