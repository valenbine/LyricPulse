import { useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { TemplateShell } from '../components/TemplateShell'
import { TrackTitle } from '../components/TrackTitle'
import { CaptionPanel, FloatingCover } from './visual-utils'

export function MoonRing({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const ringSize = isWide ? 640 : 660
  const ringLeft = isWide ? 98 : (1080 - ringSize) / 2
  const ringTop = isWide ? 205 : 180
  const coverSize = isWide ? 340 : 380

  return (
    <TemplateShell config={config} variant="neon">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: ringLeft,
            top: ringTop,
            width: ringSize,
            height: ringSize,
            borderRadius: '50%',
            border: `4px solid ${config.theme.accentColor}66`,
            boxShadow: `0 0 ${80 + analysisFrame.treble * 90}px ${config.theme.accentColor}30 inset, 0 0 80px ${config.theme.accentColor}22`,
            transform: `rotate(${frame * 0.08}deg)`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: ringLeft + 56,
            top: ringTop + 56,
            width: ringSize - 112,
            height: ringSize - 112,
            borderRadius: '50%',
            border: '1px solid rgba(248,250,252,0.22)'
          }}
        />
        <FloatingCover
          config={config}
          left={ringLeft + (ringSize - coverSize) / 2}
          top={ringTop + (ringSize - coverSize) / 2}
          size={coverSize}
          radius={999}
          circle
          scale={1 + analysisFrame.bass * 0.035}
        />
        <div
          style={{ position: 'absolute', left: isWide ? 830 : 86, right: isWide ? 110 : 86, top: isWide ? 210 : 900 }}
        >
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={config}
          text={lyricLine?.text}
          left={isWide ? 830 : 76}
          right={isWide ? 110 : 76}
          top={isWide ? 500 : 1130}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 72 : 84}
        />
      </div>
    </TemplateShell>
  )
}
