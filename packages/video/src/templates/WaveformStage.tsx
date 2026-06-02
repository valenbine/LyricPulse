import { useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { LyricDisplay } from '../components/LyricDisplay'
import { TemplateShell } from '../components/TemplateShell'

export function WaveformStage({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const bars = Array.from({ length: isWide ? 56 : 34 }, (_, index) => {
    const phase = Math.sin(frame / 8 + index * 0.55)
    return 34 + (phase + 1) * 70 * analysisFrame.bass
  })

  return (
    <TemplateShell config={config} variant="waveform">
      <div
        style={{
          position: 'absolute',
          left: isWide ? 130 : 86,
          right: isWide ? 130 : 86,
          top: isWide ? 150 : 220,
          bottom: isWide ? 150 : 220,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            gap: isWide ? 12 : 10,
            height: isWide ? 240 : 320,
            opacity: 0.88
          }}
        >
          {bars.map((height, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height,
                borderRadius: 999,
                background: `linear-gradient(180deg, ${config.theme.accentColor}, #38bdf8)`,
                boxShadow: `0 0 24px ${config.theme.accentColor}66`
              }}
            />
          ))}
        </div>
        <LyricDisplay
          config={config}
          line={lyricLine}
          scale={1 + analysisFrame.rms * 0.05}
          align={isWide ? 'left' : 'center'}
        />
      </div>
    </TemplateShell>
  )
}
