import type { LyricVideoConfig } from '@lyricpulse/core'
import { neuralConstellationProfile, ProfileTemplate } from './profile-template'

export function NeuralConstellation({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={neuralConstellationProfile} />
}
