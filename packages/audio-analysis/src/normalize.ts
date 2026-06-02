import type { AudioAnalysis, AudioAnalysisFrame } from '@lyricpulse/core'

export type PartialAnalysisInput = {
  duration?: number
  loudness?: number
  bpm?: number
  beats?: number[]
  frames?: AudioAnalysisFrame[]
}

export function normalizeAudioAnalysis(
  input: PartialAnalysisInput
): AudioAnalysis {
  const unavailableFields: AudioAnalysis['unavailableFields'] = []
  const duration = input.duration && input.duration > 0 ? input.duration : 1
  const beats = input.beats ?? createFallbackBeats(duration, input.bpm ?? 120)
  const frames =
    input.frames ?? createFallbackFrames(duration, input.loudness ?? -24)

  if (input.bpm === undefined) {
    unavailableFields.push('bpm')
  }

  if (input.beats === undefined) {
    unavailableFields.push('beats')
  }

  if (input.loudness === undefined) {
    unavailableFields.push('loudness')
  }

  if (input.frames === undefined) {
    unavailableFields.push('frequencyBands')
  }

  return {
    duration,
    ...(input.bpm === undefined ? {} : { bpm: input.bpm }),
    beats,
    frames,
    ...(unavailableFields.length === 0 ? {} : { unavailableFields })
  }
}

function createFallbackBeats(duration: number, bpm: number): number[] {
  const interval = 60 / bpm
  const beats: number[] = []

  for (let time = 0; time <= duration; time += interval) {
    beats.push(round(time))
  }

  return beats
}

function createFallbackFrames(
  duration: number,
  loudness: number
): AudioAnalysisFrame[] {
  const frames: AudioAnalysisFrame[] = []
  const frameCount = Math.max(1, Math.ceil(duration * 10))
  const normalizedLoudness = Math.max(0, Math.min(1, (loudness + 60) / 60))

  for (let index = 0; index < frameCount; index += 1) {
    const time = round((index / frameCount) * duration)

    frames.push({
      time,
      rms: normalizedLoudness,
      loudness,
      bass: normalizedLoudness * 0.6,
      mid: normalizedLoudness * 0.4,
      treble: normalizedLoudness * 0.25
    })
  }

  return frames
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
