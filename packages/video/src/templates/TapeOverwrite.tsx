import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, tapeOverwriteProfile } from './profile-template'

export function TapeOverwrite({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={tapeOverwriteProfile} />
}
