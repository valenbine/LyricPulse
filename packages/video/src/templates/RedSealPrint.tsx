import type { LyricVideoConfig } from '@lyricpulse/core'
import { redSealPrintProfile, ProfileTemplate } from './profile-template'

export function RedSealPrint({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={redSealPrintProfile} />
}
