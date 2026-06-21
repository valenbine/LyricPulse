import { describe, expect, it } from 'vitest'
import { createTemplateConfig } from './sample-config'
import { getBeatLighting } from './beat-lighting'

describe('getBeatLighting', () => {
  it('raises ambient and frame glow as beat energy increases', () => {
    const config = createTemplateConfig('NeonLyric', '9:16')
    const quiet = getBeatLighting(
      config,
      { time: 0, rms: 0.08, loudness: -24, bass: 0.06, mid: 0.08, treble: 0.05 },
      'neon'
    )
    const loud = getBeatLighting(
      config,
      { time: 0.5, rms: 0.92, loudness: -7, bass: 0.94, mid: 0.82, treble: 0.78 },
      'neon'
    )

    expect(loud.ambientOpacity).toBeGreaterThan(quiet.ambientOpacity)
    expect(loud.beamOpacity).toBeGreaterThan(quiet.beamOpacity)
    expect(loud.frameGlowBlur).toBeGreaterThan(quiet.frameGlowBlur)
  })

  it('keeps dashboard lighting more restrained than pulse for the same frame', () => {
    const config = createTemplateConfig('PulseCover', '16:9')
    const analysisFrame = {
      time: 1,
      rms: 0.72,
      loudness: -10,
      bass: 0.88,
      mid: 0.61,
      treble: 0.54
    }

    const dashboard = getBeatLighting(config, analysisFrame, 'dashboard')
    const pulse = getBeatLighting(config, analysisFrame, 'pulse')

    expect(pulse.ambientOpacity).toBeGreaterThan(dashboard.ambientOpacity)
    expect(pulse.frameGlowOpacity).toBeGreaterThan(dashboard.frameGlowOpacity)
  })

  it('reduces lighting visibility when stage lighting is lowered', () => {
    const config = createTemplateConfig('WaveformStage', '16:9')
    const analysisFrame = {
      time: 1,
      rms: 0.72,
      loudness: -10,
      bass: 0.88,
      mid: 0.61,
      treble: 0.54
    }

    const full = getBeatLighting(config, analysisFrame, 'waveform')
    const reduced = getBeatLighting(
      {
        ...config,
        effect: {
          ...config.effect,
          stageLighting: 0.2
        }
      },
      analysisFrame,
      'waveform'
    )

    expect(reduced.ambientOpacity).toBeLessThan(full.ambientOpacity)
    expect(reduced.beamOpacity).toBeLessThan(full.beamOpacity)
    expect(reduced.frameGlowOpacity).toBeLessThan(full.frameGlowOpacity)
  })
})
