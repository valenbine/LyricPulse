import type { LyricLine, LyricVideoConfig } from '@lyricpulse/core'

export function LyricDisplay({
  config,
  line,
  scale = 1,
  align = 'center'
}: {
  config: LyricVideoConfig
  line?: LyricLine
  scale?: number
  align?: 'center' | 'left'
}) {
  return (
    <div
      style={{
        maxWidth: config.ratio === '16:9' ? 840 : 860,
        textAlign: align,
        transform: `scale(${scale})`,
        transition: 'none',
        color: config.theme.primaryColor,
        textShadow: `0 0 ${28 * config.effect.lyricGlow}px ${config.theme.accentColor}`
      }}
    >
      <div
        style={{
          fontSize: config.ratio === '16:9' ? 72 : 82,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.08
        }}
      >
        {line?.text ?? 'LyricPulse'}
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: config.ratio === '16:9' ? 24 : 28,
          opacity: 0.62,
          letterSpacing: '0.22em',
          textTransform: 'uppercase'
        }}
      >
        {config.artist ?? 'Dynamic lyric video'}
      </div>
    </div>
  )
}
