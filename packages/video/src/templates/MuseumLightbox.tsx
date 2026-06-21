import type { LyricVideoConfig } from '@lyricpulse/core'
import { museumLightboxProfile, ProfileTemplate } from './profile-template'

export function MuseumLightbox({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={museumLightboxProfile} />
}
