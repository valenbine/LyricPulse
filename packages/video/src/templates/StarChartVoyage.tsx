import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, starChartVoyageProfile } from './profile-template'

export function StarChartVoyage({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={starChartVoyageProfile} />
}
