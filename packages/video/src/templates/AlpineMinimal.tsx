import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, alpineMinimalProfile } from './profile-template'

export function AlpineMinimal({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={alpineMinimalProfile} />
}
