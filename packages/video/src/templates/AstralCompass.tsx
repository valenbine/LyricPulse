import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, astralCompassProfile } from './profile-template'

export function AstralCompass({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={astralCompassProfile} />
}
