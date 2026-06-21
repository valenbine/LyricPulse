import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, neonConvenienceProfile } from './profile-template'

export function NeonConvenience({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={neonConvenienceProfile} />
}
