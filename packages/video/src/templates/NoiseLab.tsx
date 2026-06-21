import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, noiseLabProfile } from './profile-template'

export function NoiseLab({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={noiseLabProfile} />
}
