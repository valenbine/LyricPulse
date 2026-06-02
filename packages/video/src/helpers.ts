import type {
  AudioAnalysisFrame,
  LyricLine,
  LyricVideoConfig
} from '@lyricpulse/core'

export function getCurrentLyricLine(
  lyrics: LyricLine[],
  currentTime: number
): LyricLine | undefined {
  return lyrics.find((line, index) => {
    const nextLine = lyrics[index + 1]
    const endTime =
      line.endTime ?? nextLine?.startTime ?? Number.POSITIVE_INFINITY

    return currentTime >= line.startTime && currentTime < endTime
  })
}

export function getAnalysisFrame(
  frames: AudioAnalysisFrame[],
  currentTime: number
): AudioAnalysisFrame {
  if (frames.length === 0) {
    return {
      time: currentTime,
      rms: 0.3,
      loudness: -24,
      bass: 0.2,
      mid: 0.2,
      treble: 0.2
    }
  }

  return frames.reduce((closest, frame) => {
    const closestDistance = Math.abs(closest.time - currentTime)
    const frameDistance = Math.abs(frame.time - currentTime)

    return frameDistance < closestDistance ? frame : closest
  }, frames[0] as AudioAnalysisFrame)
}

export function getPlaybackTime(frame: number, fps: number): number {
  return frame / fps
}

export function getDurationInFrames(
  config: LyricVideoConfig,
  fps: number
): number {
  return Math.max(1, Math.ceil(config.analysis.duration * fps))
}
