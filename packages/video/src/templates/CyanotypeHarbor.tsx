import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, cyanotypeHarborProfile } from './profile-template'

export function CyanotypeHarbor({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={cyanotypeHarborProfile} />
}
