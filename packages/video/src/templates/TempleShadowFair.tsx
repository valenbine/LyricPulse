import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, templeShadowFairProfile } from './profile-template'

export function TempleShadowFair({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={templeShadowFairProfile} />
}
