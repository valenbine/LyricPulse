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

export function InkScroll({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const inkDrift = Math.sin(frame / 44) * 26
  const coverSize = isWide ? 390 : 480

  return (
    <TemplateShell config={config} variant="pulse">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: isWide ? '92px 100px' : '84px 36px',
            borderRadius: isWide ? 46 : 58,
            background:
              'linear-gradient(135deg, rgba(255,251,235,0.92), rgba(226,232,240,0.78))',
            boxShadow: '0 30px 90px rgba(0,0,0,0.34)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: isWide ? 180 : 100,
            top: isWide ? 140 : 150,
            width: isWide ? 760 : 720,
            height: isWide ? 420 : 680,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.theme.accentColor}36, rgba(15,23,42,0.18), transparent 68%)`,
            filter: 'blur(26px)',
            transform: `translate(${inkDrift}px, ${-inkDrift / 2}px)`,
            opacity: 0.72
          }}
        />
        <FloatingCover
          config={config}
          left={isWide ? 250 : (1080 - coverSize) / 2}
          top={isWide ? 285 : 270}
          size={coverSize}
          radius={26}
          rotate={isWide ? -4 : 0}
          scale={1 + analysisFrame.bass * 0.025}
        />
        <div
          style={{
            position: 'absolute',
            left: isWide ? 780 : 64,
            right: isWide ? 170 : 64,
            top: isWide ? 230 : 850,
            color: '#0F172A'
          }}
        >
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel
          config={{
            ...config,
            theme: { ...config.theme, primaryColor: '#0F172A' }
          }}
          text={lyricLine?.text}
          left={isWide ? 790 : 64}
          right={isWide ? 160 : 64}
          top={isWide ? 500 : 1100}
          align={isWide ? 'left' : 'center'}
          fontSize={isWide ? 72 : 86}
        />
      </div>
    </TemplateShell>
  )
}
