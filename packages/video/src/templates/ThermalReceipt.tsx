import type { LyricVideoConfig } from '@lyricpulse/core'
import { ProfileTemplate, thermalReceiptProfile } from './profile-template'

export function ThermalReceipt({ config }: { config: LyricVideoConfig }) {
  return <ProfileTemplate config={config} profile={thermalReceiptProfile} />
}
