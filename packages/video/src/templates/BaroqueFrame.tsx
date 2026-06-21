import type { LyricVideoConfig } from '@lyricpulse/core'
import { baroqueFrameProfile, ProfileTemplate } from './profile-template'

export function BaroqueFrame({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={baroqueFrameProfile} />
}
