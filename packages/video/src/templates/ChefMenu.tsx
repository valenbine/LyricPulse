import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, chefMenuProfile } from './profile-template'

export function ChefMenu({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={chefMenuProfile} />
}
