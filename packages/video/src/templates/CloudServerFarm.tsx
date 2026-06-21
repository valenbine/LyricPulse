import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, cloudServerFarmProfile } from './profile-template'

export function CloudServerFarm({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={cloudServerFarmProfile} />
}
