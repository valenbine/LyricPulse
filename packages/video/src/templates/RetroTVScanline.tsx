import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, retroTvScanlineProfile } from './profile-template'

export function RetroTVScanline({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={retroTvScanlineProfile} />
}
