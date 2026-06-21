import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, hazeBlueprintProfile } from './profile-template'

export function HazeBlueprint({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={hazeBlueprintProfile} />
}
