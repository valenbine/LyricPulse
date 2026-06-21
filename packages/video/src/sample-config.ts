import type { LyricVideoConfig } from '@lyricpulse/core'

export const sampleLyricVideoConfig: LyricVideoConfig = {
  projectId: 'sample-project',
  ratio: '9:16',
  templateId: 'PulseCover',
  title: 'LyricPulse Demo',
  artist: 'Demo Artist',
  audioAssetId: 'sample-audio',
  coverAssetId: 'sample-cover',
  coverUrl:
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  lyrics: [
    { id: 'line-1', startTime: 0, endTime: 3, text: 'Feel the pulse begin' },
    {
      id: 'line-2',
      startTime: 3,
      endTime: 6,
      text: 'Every word starts to glow'
    },
    {
      id: 'line-3',
      startTime: 6,
      endTime: 9,
      text: 'Lyrics move with the beat'
    }
  ],
  analysis: {
    duration: 9,
    bpm: 120,
    beats: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
    frames: Array.from({ length: 90 }, (_, index) => {
      const pulse = (Math.sin(index / 4) + 1) / 2

      return {
        time: index / 10,
        rms: 0.3 + pulse * 0.5,
        loudness: -22 + pulse * 8,
        bass: 0.35 + pulse * 0.55,
        mid: 0.3 + pulse * 0.4,
        treble: 0.2 + pulse * 0.5
      }
    })
  },
  theme: {
    primaryColor: '#f8fafc',
    accentColor: '#a855f7',
    backgroundIntensity: 0.85,
    fontFamily:
      'Noto Sans CJK SC, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif'
  },
  effect: {
    lyricGlow: 0.8,
    pulseIntensity: 0.75,
    beatImpact: 0.7,
    stageLighting: 0.75
  }
}

export function createTemplateConfig(
  templateId: LyricVideoConfig['templateId'],
  ratio: LyricVideoConfig['ratio']
): LyricVideoConfig {
  return {
    ...sampleLyricVideoConfig,
    templateId,
    ratio
  }
}
