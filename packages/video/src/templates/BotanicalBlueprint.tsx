import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, botanicalBlueprintProfile } from './profile-template'

export function BotanicalBlueprint({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={botanicalBlueprintProfile} />
}
