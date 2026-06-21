import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, filmContactSheetProfile } from './profile-template'

export function FilmContactSheet({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={filmContactSheetProfile} />
}
