import { AbsoluteFill, Img } from 'remotion'

export function CoverArtwork({
  src,
  alt,
  borderRadius,
  overlayOpacity = 0.12
}: {
  src?: string
  alt: string
  borderRadius: number
  overlayOpacity?: number
}) {
  if (!src) {
    return null
  }

  return (
    <AbsoluteFill
      style={{
        borderRadius,
        overflow: 'hidden'
      }}
    >
      <Img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${overlayOpacity}) 0%, rgba(2,6,23,0.05) 35%, rgba(2,6,23,0.38) 100%)`
        }}
      />
    </AbsoluteFill>
  )
}
