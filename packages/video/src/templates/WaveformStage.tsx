import { useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { CoverArtwork } from '../components/CoverArtwork'
import { LyricDisplay } from '../components/LyricDisplay'
import { TemplateShell } from '../components/TemplateShell'
import { TrackTitle } from '../components/TrackTitle'
import { isServerRender } from '../render-mode'

export function WaveformStage({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const fastRender = isServerRender(config)
  const bars = Array.from({ length: fastRender ? 18 : isWide ? 56 : 34 }, (_, index) => {
    const phase = Math.sin(frame / 8 + index * 0.55)
    return 36 + (phase + 1) * 86 * Math.max(0.22, analysisFrame.bass)
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
        <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            gap: isWide ? 12 : 10,
            height: isWide ? 240 : 320,
            opacity: 0.96,
            padding: 24,
            borderRadius: 36,
            background: 'rgba(2,6,23,0.48)',
            border: `1px solid ${config.theme.accentColor}55`,
            boxShadow: fastRender
              ? '0 14px 32px rgba(0,0,0,0.32)'
              : '0 28px 90px rgba(0,0,0,0.35)'
          }}
        >
          <div
            style={{
              width: isWide ? 164 : 140,
              height: isWide ? 164 : 140,
              flexShrink: 0,
              borderRadius: 28,
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.22)',
              boxShadow: fastRender
                ? '0 10px 22px rgba(2,6,23,0.28)'
                : '0 18px 40px rgba(2,6,23,0.3)',
              alignSelf: 'center'
            }}
          >
            <CoverArtwork
              src={config.coverUrl}
              alt={config.title ?? 'cover artwork'}
              borderRadius={26}
              overlayOpacity={0.1}
            />
          </div>
          {bars.map((height, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height,
                borderRadius: 999,
                background: `linear-gradient(180deg, #FFFFFF 0%, ${config.theme.accentColor} 42%, #0EA5E9 100%)`,
                boxShadow: fastRender
                  ? undefined
                  : `0 0 22px ${config.theme.accentColor}88`
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
