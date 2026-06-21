import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, microscopeSlideProfile } from './profile-template'

export function MicroscopeSlide({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={microscopeSlideProfile} />
}
