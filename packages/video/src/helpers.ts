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

  const nextIndex = findFrameInsertionIndex(frames, currentTime)

  if (nextIndex === 0) {
    return frames[0] as AudioAnalysisFrame
  }

  if (nextIndex >= frames.length) {
    return frames[frames.length - 1] as AudioAnalysisFrame
  }

  const previous = frames[nextIndex - 1] as AudioAnalysisFrame
  const next = frames[nextIndex] as AudioAnalysisFrame
  const previousDistance = Math.abs(previous.time - currentTime)
  const nextDistance = Math.abs(next.time - currentTime)

  return nextDistance < previousDistance ? next : previous
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

function findFrameInsertionIndex(
  frames: AudioAnalysisFrame[],
  currentTime: number
) {
  let low = 0
  let high = frames.length

  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    const frame = frames[middle] as AudioAnalysisFrame

    if (frame.time < currentTime) {
      low = middle + 1
    } else {
      high = middle
    }
  }

  return low
}
