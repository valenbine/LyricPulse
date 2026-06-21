import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, explodedManualProfile } from './profile-template'

export function ExplodedManual({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={explodedManualProfile} />
}
