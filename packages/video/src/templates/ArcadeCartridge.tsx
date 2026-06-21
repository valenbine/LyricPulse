import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, arcadeCartridgeProfile } from './profile-template'

export function ArcadeCartridge({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={arcadeCartridgeProfile} />
}
