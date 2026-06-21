import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, topographicSandboxProfile } from './profile-template'

export function TopographicSandbox({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={topographicSandboxProfile} />
}
