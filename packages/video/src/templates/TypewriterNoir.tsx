import { useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { TemplateShell } from '../components/TemplateShell'
import { FloatingCover } from './visual-utils'

export function TypewriterNoir({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const coverSize = isWide ? 350 : 430
  const cursorVisible = Math.floor(frame / 12) % 2 === 0

  return (
    <TemplateShell config={config} variant="dashboard">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: isWide ? '82px 100px' : '82px 62px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #F8FAFC, #CBD5E1)',
            boxShadow: '0 38px 120px rgba(0,0,0,0.5)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              'repeating-linear-gradient(0deg, #020617 0px, #020617 1px, transparent 1px, transparent 8px)'
          }}
        />
        <FloatingCover
          config={config}
          left={isWide ? 150 : (1080 - coverSize) / 2}
          top={isWide ? 300 : 250}
          size={coverSize}
          radius={8}
          rotate={isWide ? -2 : 0}
          scale={1 + analysisFrame.bass * 0.02}
        />
        <div
          style={{
            position: 'absolute',
            left: isWide ? 650 : 92,
            right: isWide ? 130 : 92,
            top: isWide ? 185 : 780,
            color: '#020617',
            fontFamily: 'Georgia, serif'
          }}
        >
          <div style={{ fontSize: isWide ? 30 : 36, fontWeight: 800, letterSpacing: '0.18em' }}>
            CASE FILE / {config.artist ?? 'UNKNOWN'}
          </div>
          <div style={{ marginTop: 24, fontSize: isWide ? 88 : 100, fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 0.92 }}>
            {config.title ?? 'LyricPulse'}
          </div>
          <div
            style={{
              marginTop: isWide ? 58 : 70,
              padding: isWide ? '34px 38px' : '42px 38px',
              borderTop: '5px solid #020617',
              borderBottom: '1px solid #020617',
              fontSize: isWide ? 70 : 84,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.045em'
            }}
          >
            {lyricLine?.text ?? 'LyricPulse'}
            <span style={{ opacity: cursorVisible ? 1 : 0 }}>_</span>
          </div>
        </div>
      </div>
    </TemplateShell>
  )
}
