import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, xrayCassetteProfile } from './profile-template'

export function XrayCassette({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={xrayCassetteProfile} />
}
