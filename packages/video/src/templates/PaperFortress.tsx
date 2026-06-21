import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, paperFortressProfile } from './profile-template'

export function PaperFortress({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={paperFortressProfile} />
}
