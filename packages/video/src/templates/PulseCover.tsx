import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { LyricDisplay } from '../components/LyricDisplay'
import { TemplateShell } from '../components/TemplateShell'

export function PulseCover({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const coverScale =
    1 + analysisFrame.bass * 0.12 * config.effect.pulseIntensity
  const lyricScale = 1 + analysisFrame.rms * 0.05 * config.effect.beatImpact
  const halo = interpolate(analysisFrame.bass, [0, 1], [0.28, 0.85])

  return (
    <TemplateShell config={config} variant="pulse">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: isWide ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isWide ? 92 : 72,
          padding: isWide ? '96px 140px' : '150px 86px'
        }}
      >
        <div
          style={{
            width: isWide ? 440 : 620,
            height: isWide ? 440 : 620,
            borderRadius: 48,
            transform: `scale(${coverScale})`,
            background: `linear-gradient(135deg, ${config.theme.accentColor}, #38bdf8)`,
            boxShadow: `0 0 ${120 * halo}px ${config.theme.accentColor}`,
            display: 'grid',
            placeItems: 'center',
            fontSize: isWide ? 84 : 110,
            fontWeight: 900,
            letterSpacing: '-0.08em'
          }}
        >
          LP
        </div>
        <LyricDisplay
          config={config}
          line={lyricLine}
          scale={lyricScale}
          align={isWide ? 'left' : 'center'}
        />
      </div>
    </TemplateShell>
  )
}
