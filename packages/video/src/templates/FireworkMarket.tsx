import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, fireworkMarketProfile } from './profile-template'

export function FireworkMarket({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={fireworkMarketProfile} />
}
