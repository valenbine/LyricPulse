import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, sundialCourtyardProfile } from './profile-template'

export function SundialCourtyard({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={sundialCourtyardProfile} />
}
