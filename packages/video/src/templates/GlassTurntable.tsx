import { Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import type { LyricVideoConfig } from '@lyricpulse/core'
import {
  getAnalysisFrame,
  getCurrentLyricLine,
  getPlaybackTime
} from '../helpers'
import { LyricDisplay } from '../components/LyricDisplay'
import { TemplateShell } from '../components/TemplateShell'
import { TrackTitle } from '../components/TrackTitle'
import { isServerRender } from '../render-mode'

export function GlassTurntable({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const fastRender = isServerRender(config)
  const accent = config.theme.accentColor
  const deckWidth = isWide ? 650 : 650
  const deckHeight = isWide ? 650 : 650
  const deckLeft = isWide ? 110 : (1080 - deckWidth) / 2
  const deckTop = isWide ? 224 : 180
  const coverSize = isWide ? 330 : 340
  const armAngle = interpolate(analysisFrame.mid, [0, 1], [10, 19])

  return (
    <TemplateShell config={config} variant="dashboard">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: deckLeft,
            top: deckTop,
            width: deckWidth,
            height: deckHeight,
            borderRadius: 70,
            background:
              'linear-gradient(135deg, rgba(248,250,252,0.16), rgba(248,250,252,0.04))',
            border: '1px solid rgba(248,250,252,0.24)',
            boxShadow: fastRender
              ? '0 20px 60px rgba(0,0,0,0.38)'
              : `0 38px 120px rgba(0,0,0,0.46), 0 0 90px ${accent}18 inset`,
            backdropFilter: fastRender ? undefined : 'blur(14px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: deckLeft + (deckWidth - coverSize) / 2,
            top: deckTop + (deckHeight - coverSize) / 2,
            width: coverSize,
            height: coverSize,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '12px solid rgba(248,250,252,0.82)',
            outline: `24px solid ${accent}20`,
            boxShadow: fastRender
              ? '0 20px 50px rgba(0,0,0,0.42)'
              : `0 28px 86px rgba(0,0,0,0.5), 0 0 ${76 * config.effect.lyricGlow}px ${accent}22`,
            transform: `scale(${1 + analysisFrame.bass * 0.035}) rotate(${fastRender ? 0 : frame * 0.16}deg)`
          }}
        >
          {config.coverUrl ? (
            <Img
              src={config.coverUrl}
              alt={config.title ?? 'cover artwork'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <div
          style={{
            position: 'absolute',
            left: deckLeft + deckWidth * 0.62,
            top: deckTop + deckHeight * 0.22,
            width: isWide ? 260 : 260,
            height: 18,
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(248,250,252,0.9), ${accent})`,
            transformOrigin: 'left center',
            transform: `rotate(${armAngle}deg)`,
            boxShadow: fastRender ? undefined : `0 0 34px ${accent}55`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: deckLeft + deckWidth * 0.58,
            top: deckTop + deckHeight * 0.17,
            width: 86,
            height: 86,
            borderRadius: '50%',
            background: '#F8FAFC',
            boxShadow: `0 12px 34px rgba(0,0,0,0.36), 0 0 32px ${accent}44`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: isWide ? 850 : 84,
            right: isWide ? 118 : 84,
            top: isWide ? 214 : 890,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isWide ? 'flex-start' : 'center',
            gap: 34
          }}
        >
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} />
          <LyricDisplay
            config={config}
            line={lyricLine}
            scale={1 + analysisFrame.rms * 0.045}
            align={isWide ? 'left' : 'center'}
          />
        </div>
      </div>
    </TemplateShell>
  )
}
