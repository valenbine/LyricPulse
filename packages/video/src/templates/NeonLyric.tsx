import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { LyricDisplay } from '../components/LyricDisplay'
import { TemplateShell } from '../components/TemplateShell'

export function NeonLyric({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const glow = interpolate(analysisFrame.treble, [0, 1], [32, 110])
  const drift = Math.sin(frame / 24) * 42

  return (
    <TemplateShell config={config} variant="neon">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: isWide ? 120 : 96
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: isWide ? 900 : 760,
            height: isWide ? 900 : 760,
            borderRadius: '50%',
            background: `conic-gradient(from ${frame * 2}deg, ${config.theme.accentColor}, #22d3ee, #fb7185, ${config.theme.accentColor})`,
            filter: `blur(${glow}px)`,
            opacity: 0.42 * config.theme.backgroundIntensity,
            transform: `translate(${drift}px, ${-drift / 2}px)`
          }}
        />
        <LyricDisplay
          config={config}
          line={lyricLine}
          scale={1 + analysisFrame.mid * 0.08}
        />
      </div>
    </TemplateShell>
  )
}
