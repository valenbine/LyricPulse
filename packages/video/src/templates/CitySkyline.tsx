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

export function CitySkyline({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const coverSize = isWide ? 370 : 470

  return (
    <TemplateShell config={config} variant="dashboard">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: isWide ? 300 : 480,
            background: `linear-gradient(180deg, transparent, ${config.theme.accentColor}18 22%, #020617)`
          }}
        />
        {Array.from({ length: isWide ? 18 : 12 }).map((_, index) => {
          const width = isWide ? 88 : 92
          const height = (isWide ? 90 : 120) + ((index * 47) % 180) + analysisFrame.bass * 40
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: index * width,
                bottom: 0,
                width: width - 10,
                height,
                borderRadius: '18px 18px 0 0',
                background: 'linear-gradient(180deg, #1E293B, #020617)',
                boxShadow: `0 0 ${12 + analysisFrame.treble * 26}px ${config.theme.accentColor}44 inset`
              }}
            />
          )
        })}
        <FloatingCover
          config={config}
          left={isWide ? 170 : (1080 - coverSize) / 2}
          top={isWide ? 270 : 240}
          size={coverSize}
          radius={42}
          rotate={Math.sin(frame / 45) * 2}
        />
        <div style={{ position: 'absolute', left: isWide ? 720 : 82, right: isWide ? 120 : 82, top: isWide ? 210 : 790 }}>
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={config}
          text={lyricLine?.text}
          left={isWide ? 720 : 76}
          right={isWide ? 120 : 76}
          top={isWide ? 500 : 1190}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 72 : 72}
        />
      </div>
    </TemplateShell>
  )
}
