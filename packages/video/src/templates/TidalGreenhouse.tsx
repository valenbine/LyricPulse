import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, tidalGreenhouseProfile } from './profile-template'

export function TidalGreenhouse({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={tidalGreenhouseProfile} />
}
