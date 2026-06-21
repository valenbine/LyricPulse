import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, cyberKabukiProfile } from './profile-template'

export function CyberKabuki({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={cyberKabukiProfile} />
}
