import type { LyricVideoConfig } from '@lyricpulse/core'
import { tarotCardProfile, ProfileTemplate } from './profile-template'

export function TarotCard({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={tarotCardProfile} />
}
