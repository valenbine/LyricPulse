import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
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

export function NeonLyric({ config }: { config: LyricVideoConfig }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = getPlaybackTime(frame, fps)
  const analysisFrame = getAnalysisFrame(config.analysis.frames, time)
  const lyricLine = getCurrentLyricLine(config.lyrics, time)
  const isWide = config.ratio === '16:9'
  const fastRender = isServerRender(config)
  const glow = interpolate(analysisFrame.treble, [0, 1], [14, 42])
  const drift = Math.sin(frame / 28) * 30
  const coverSize = isWide ? 220 : 360
  const coverLeft = isWide ? 116 : (1080 - coverSize) / 2
  const coverTop = isWide ? 116 : 180
  const titlePosition = isWide
    ? { right: 116, top: 112, width: 760 }
    : { left: 76, right: 76, top: 610 }
  const lyricTop = isWide ? 0 : 1120

  return (
    <TemplateShell config={config} variant="neon">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: isWide ? 120 : 96
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: isWide ? 1040 : 820,
            height: isWide ? 1040 : 820,
            borderRadius: '50%',
            background: `conic-gradient(from ${frame * 2}deg, transparent 0deg, ${config.theme.accentColor} 70deg, #FFFFFF 110deg, #0EA5E9 160deg, transparent 240deg, ${config.theme.accentColor} 360deg)`,
            filter: fastRender ? undefined : `blur(${glow}px)`,
            opacity: (fastRender ? 0.18 : 0.3) * config.theme.backgroundIntensity,
            transform: `translate(${drift}px, ${-drift / 2}px)`
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: isWide ? '170px 230px' : '280px 110px',
            borderRadius: 999,
            border: `3px solid ${config.theme.accentColor}`,
            opacity: 0.46,
            boxShadow: fastRender
              ? `0 0 16px ${config.theme.accentColor}66`
              : `0 0 48px ${config.theme.accentColor}88`,
            transform: `rotate(${frame * 0.35}deg) scale(${1 + analysisFrame.rms * 0.05})`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: coverLeft,
            top: coverTop,
            width: coverSize,
            height: coverSize,
            borderRadius: 34,
            overflow: 'hidden',
            border: `3px solid ${config.theme.accentColor}99`,
            boxShadow: fastRender
              ? `0 12px 28px rgba(2,6,23,0.38), 0 0 14px ${config.theme.accentColor}66`
              : `0 22px 60px rgba(2,6,23,0.42), 0 0 38px ${config.theme.accentColor}77`
          }}
        >
          <CoverArtwork
            src={config.coverUrl}
            alt={config.title ?? 'cover artwork'}
            borderRadius={31}
            overlayOpacity={0.14}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            ...titlePosition
          }}
        >
          <TrackTitle config={config} align={isWide ? 'left' : 'center'} position="compact" />
        </div>
        <div
          style={{
            position: isWide ? undefined : 'absolute',
            left: isWide ? undefined : 40,
            right: isWide ? undefined : 40,
            top: isWide ? undefined : lyricTop
          }}
        >
          <LyricDisplay
            config={config}
            line={lyricLine}
            scale={1 + analysisFrame.mid * 0.08}
          />
        </div>
      </div>
    </TemplateShell>
  )
}
