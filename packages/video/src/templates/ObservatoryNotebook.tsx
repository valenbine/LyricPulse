import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, observatoryNotebookProfile } from './profile-template'

export function ObservatoryNotebook({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={observatoryNotebookProfile} />
}
