import type { ReactNode } from 'react'
import { AbsoluteFill } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'

export function TemplateShell({
  config,
  children,
  variant
}: {
  config: LyricVideoConfig
  children: ReactNode
  variant: 'pulse' | 'neon' | 'waveform'
}) {
  const isWide = config.ratio === '16:9'
  const accent = config.theme.accentColor
  const baseGradient =
    variant === 'neon'
      ? `radial-gradient(circle at 20% 20%, ${accent}66, transparent 32%), linear-gradient(135deg, #050816, #10041f 52%, #020617)`
      : variant === 'waveform'
        ? `radial-gradient(circle at 80% 30%, ${accent}55, transparent 30%), linear-gradient(135deg, #020617, #111827 48%, #030712)`
        : `radial-gradient(circle at 50% 25%, ${accent}66, transparent 35%), linear-gradient(180deg, #050816, #0f172a 52%, #020617)`

  return (
    <AbsoluteFill
      style={{
        background: baseGradient,
        color: config.theme.primaryColor,
        fontFamily: config.theme.fontFamily,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: isWide ? 56 : 48,
          border: `1px solid ${accent}33`,
          borderRadius: isWide ? 44 : 56,
          boxShadow: `0 0 80px ${accent}33 inset`,
          pointerEvents: 'none'
        }}
      />
      {children}
    </AbsoluteFill>
  )
}
