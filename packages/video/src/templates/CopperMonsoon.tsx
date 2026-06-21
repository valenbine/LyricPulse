import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, copperMonsoonProfile } from './profile-template'

export function CopperMonsoon({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={copperMonsoonProfile} />
}
