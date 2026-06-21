import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, nightRadioDialProfile } from './profile-template'

export function NightRadioDial({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={nightRadioDialProfile} />
}
