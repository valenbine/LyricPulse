import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, retroGameHudProfile } from './profile-template'

export function RetroGameHUD({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={retroGameHudProfile} />
}
