import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, paperTheaterProfile } from './profile-template'

export function PaperTheater({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={paperTheaterProfile} />
}
