import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, quartzForecastProfile } from './profile-template'

export function QuartzForecast({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={quartzForecastProfile} />
}
