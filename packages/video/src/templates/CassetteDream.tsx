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

export function CassetteDream({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const tapeWidth = isWide ? 680 : 760
  const tapeHeight = isWide ? 410 : 460
  const tapeLeft = isWide ? 110 : (1080 - tapeWidth) / 2
  const tapeTop = isWide ? 340 : 330
  const spool = 96 + analysisFrame.bass * 18

  return (
    <TemplateShell config={config} variant="pulse">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 20% 20%, ${config.theme.accentColor}33, transparent 28%), linear-gradient(135deg, #2B1208, #111827 58%, #020617)`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: tapeLeft,
            top: tapeTop,
            width: tapeWidth,
            height: tapeHeight,
            borderRadius: 46,
            background:
              'linear-gradient(135deg, rgba(255,247,237,0.96), rgba(251,191,36,0.78))',
            border: '10px solid rgba(15,23,42,0.72)',
            boxShadow: '0 30px 90px rgba(0,0,0,0.48)'
          }}
        />
        {[0, 1].map((index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: tapeLeft + (index === 0 ? 145 : tapeWidth - 145 - spool),
              top: tapeTop + 145,
              width: spool,
              height: spool,
              borderRadius: '50%',
              background: `repeating-radial-gradient(circle, #0F172A 0px, #0F172A 10px, ${config.theme.accentColor} 12px, #F8FAFC 15px)`,
              transform: `rotate(${frame * (index === 0 ? 0.4 : -0.38)}deg)`
            }}
          />
        ))}
        <FloatingCover
          config={config}
          left={isWide ? 380 : (1080 - 300) / 2}
          top={isWide ? 250 : 205}
          size={isWide ? 270 : 300}
          radius={26}
          rotate={-3}
        />
        <div style={{ position: 'absolute', left: isWide ? 820 : 84, right: isWide ? 110 : 84, top: isWide ? 210 : 870 }}>
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={config}
          text={lyricLine?.text}
          left={isWide ? 820 : 76}
          right={isWide ? 110 : 76}
          top={isWide ? 500 : 1110}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 70 : 84}
        />
      </div>
    </TemplateShell>
  )
}
