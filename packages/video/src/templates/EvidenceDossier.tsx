import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, evidenceDossierProfile } from './profile-template'

export function EvidenceDossier({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={evidenceDossierProfile} />
}
