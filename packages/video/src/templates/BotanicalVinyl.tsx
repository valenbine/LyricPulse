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

export function BotanicalVinyl({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const coverSize = isWide ? 390 : 500
  const centerLeft = isWide ? 320 : 540
  const centerTop = isWide ? 520 : 520

  return (
    <TemplateShell config={config} variant="pulse">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #102A1D, #0F172A 60%, #1F2937)' }} />
        {Array.from({ length: 14 }).map((_, index) => {
          const angle = (360 / 14) * index + frame * 0.04
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: centerLeft,
                top: centerTop,
                width: isWide ? 190 : 230,
                height: isWide ? 64 : 78,
                borderRadius: '100% 0 100% 0',
                background: `linear-gradient(90deg, ${config.theme.accentColor}88, #86EFAC55)`,
                transformOrigin: '0 50%',
                transform: `rotate(${angle}deg) translateX(${isWide ? 260 : 330}px)`,
                opacity: 0.32 + analysisFrame.mid * 0.18
              }}
            />
          )
        })}
        <FloatingCover
          config={config}
          left={isWide ? 125 : (1080 - coverSize) / 2}
          top={isWide ? 320 : 270}
          size={coverSize}
          radius={999}
          circle
          scale={1 + analysisFrame.bass * 0.035}
        />
        <div style={{ position: 'absolute', left: isWide ? 700 : 86, right: isWide ? 120 : 86, top: isWide ? 210 : 850 }}>
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={config}
          text={lyricLine?.text}
          left={isWide ? 700 : 76}
          right={isWide ? 120 : 76}
          top={isWide ? 500 : 1110}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 72 : 86}
        />
      </div>
    </TemplateShell>
  )
}
