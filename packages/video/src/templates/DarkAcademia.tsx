import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, darkAcademiaProfile } from './profile-template'

export function DarkAcademia({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={darkAcademiaProfile} />
}
