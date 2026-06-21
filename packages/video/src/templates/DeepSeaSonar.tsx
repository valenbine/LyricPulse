import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, deepSeaSonarProfile } from './profile-template'

export function DeepSeaSonar({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={deepSeaSonarProfile} />
}
