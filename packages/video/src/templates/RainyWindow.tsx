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

export function RainyWindow({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const coverSize = isWide ? 390 : 500

  return (
    <TemplateShell config={config} variant="neon">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {Array.from({ length: 32 }).map((_, index) => (
          <div key={index} style={{ position: 'absolute', left: `${(index * 29) % 100}%`, top: `${(index * 17 + frame * 1.6) % 100}%`, width: 2, height: 40 + (index % 5) * 18, borderRadius: 999, background: 'rgba(186,230,253,0.42)', filter: 'blur(0.5px)' }} />
        ))}
        <div style={{ position: 'absolute', inset: isWide ? '90px 100px' : '90px 62px', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 42, background: 'rgba(15,23,42,0.32)', backdropFilter: 'blur(10px)' }} />
        <FloatingCover config={config} left={isWide ? 150 : (1080 - coverSize) / 2} top={isWide ? 300 : 250} size={coverSize} radius={42} scale={1 + analysisFrame.bass * 0.025} />
        <div style={{ position: 'absolute', left: isWide ? 700 : 84, right: isWide ? 120 : 84, top: isWide ? 210 : 840 }}>
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        </div>
        <CaptionPanel config={config} text={lyricLine?.text} left={isWide ? 700 : 76} right={isWide ? 120 : 76} top={isWide ? 500 : 1090} align={isWide ? 'left' : 'center'} fontSize={isWide ? 72 : 86} />
      </div>
    </TemplateShell>
  )
}
