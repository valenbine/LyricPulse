import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, signalLanternProfile } from './profile-template'

export function SignalLantern({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={signalLanternProfile} />
}
