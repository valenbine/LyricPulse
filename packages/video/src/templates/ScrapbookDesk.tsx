import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, scrapbookDeskProfile } from './profile-template'

export function ScrapbookDesk({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={scrapbookDeskProfile} />
}
