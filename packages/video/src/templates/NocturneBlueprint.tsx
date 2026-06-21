import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, nocturneBlueprintProfile } from './profile-template'

export function NocturneBlueprint({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={nocturneBlueprintProfile} />
}
