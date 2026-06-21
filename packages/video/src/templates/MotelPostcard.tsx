import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, motelPostcardProfile } from './profile-template'

export function MotelPostcard({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={motelPostcardProfile} />
}
