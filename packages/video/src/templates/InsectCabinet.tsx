import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, insectCabinetProfile } from './profile-template'

export function InsectCabinet({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={insectCabinetProfile} />
}
