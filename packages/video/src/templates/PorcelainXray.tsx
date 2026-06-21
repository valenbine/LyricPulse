import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, porcelainXrayProfile } from './profile-template'

export function PorcelainXray({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={porcelainXrayProfile} />
}
