import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, dataRainProfile } from './profile-template'

export function DataRain({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={dataRainProfile} />
}
