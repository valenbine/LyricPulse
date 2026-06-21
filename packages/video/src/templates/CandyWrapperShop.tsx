import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, candyWrapperShopProfile } from './profile-template'

export function CandyWrapperShop({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={candyWrapperShopProfile} />
}
