import type { LyricVideoConfig } from '@lyricpulse/core'

export type TemplateShellVariant = 'pulse' | 'neon' | 'waveform' | 'dashboard'

export type BeatLighting = {
  ambientOpacity: number
  ambientScale: number
  beamOpacity: number
  beamScale: number
  frameGlowOpacity: number
  frameGlowBlur: number
}

export function getBeatLighting(
  config: LyricVideoConfig,
  analysisFrame: LyricVideoConfig['analysis']['frames'][number],
  variant: TemplateShellVariant
): BeatLighting {
  const visibility = clamp(config.effect.stageLighting)
  const variantBias =
    variant === 'neon'
      ? 1.12
      : variant === 'pulse'
        ? 1.05
        : variant === 'waveform'
          ? 0.98
          : 0.9
  const pulseMix = clamp(config.effect.pulseIntensity * 0.62 + config.effect.beatImpact * 0.48)
  const energy = clamp(
    analysisFrame.bass * 0.5 + analysisFrame.rms * 0.35 + analysisFrame.treble * 0.15
  )
  const drive = clamp((0.18 + energy * 0.82) * (0.55 + pulseMix * 0.75) * variantBias)
  const blurMix = 0.4 + visibility * 0.6

  return {
    ambientOpacity: (0.12 + drive * 0.3) * visibility,
    ambientScale: 1 + drive * 0.08,
    beamOpacity: (0.08 + drive * 0.26) * visibility,
    beamScale: 1 + drive * 0.16,
    frameGlowOpacity: (0.12 + drive * 0.48) * visibility,
    frameGlowBlur: (48 + drive * 96) * blurMix
  }
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}
