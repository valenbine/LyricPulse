import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, filmBurnProfile } from './profile-template'

export function FilmBurn({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={filmBurnProfile} />
}
