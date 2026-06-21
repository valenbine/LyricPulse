import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, calendarMinimalProfile } from './profile-template'

export function CalendarMinimal({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={calendarMinimalProfile} />
}
