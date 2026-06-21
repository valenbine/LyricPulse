import type { LyricVideoConfig } from '@lyricpulse/core'
import { clayPosterProfile, ProfileTemplate } from './profile-template'

export function ClayPoster({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={clayPosterProfile} />
}
