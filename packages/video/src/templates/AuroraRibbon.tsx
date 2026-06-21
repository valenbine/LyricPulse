import { useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { TemplateShell } from '../components/TemplateShell'
import { TrackTitle } from '../components/TrackTitle'
import { isServerRender } from '../render-mode'
import { CaptionPanel, FloatingCover } from './visual-utils'

export function AuroraRibbon({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const fastRender = isServerRender(config)
  const wave = Math.sin(frame / 30) * 38
  const coverSize = isWide ? 410 : 500

  return (
    <TemplateShell config={config} variant="neon">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: isWide ? -120 : -260,
              top: isWide ? 180 + index * 130 : 250 + index * 210,
              width: isWide ? 2200 : 1580,
              height: isWide ? 150 : 210,
              borderRadius: 999,
              background: `linear-gradient(90deg, transparent, ${config.theme.accentColor}${index === 1 ? '66' : '44'}, #38BDF855, transparent)`,
              filter: fastRender ? undefined : 'blur(22px)',
              opacity: 0.62 * config.theme.backgroundIntensity,
              transform: `rotate(${isWide ? -10 : -18}deg) translateX(${wave * (index + 1)}px)`
            }}
          />
        ))}
        <FloatingCover
          config={config}
          left={isWide ? 150 : (1080 - coverSize) / 2}
          top={isWide ? 310 : 260}
          size={coverSize}
          radius={54}
          scale={1 + analysisFrame.bass * 0.04}
        />
        <div
          style={{
            position: 'absolute',
            left: isWide ? 720 : 86,
            right: isWide ? 120 : 86,
            top: isWide ? 210 : 850
          }}
        >
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={config}
          text={lyricLine?.text}
          left={isWide ? 720 : 76}
          right={isWide ? 120 : 76}
          top={isWide ? 500 : 1090}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 76 : 88}
        />
      </div>
    </TemplateShell>
  )
}
