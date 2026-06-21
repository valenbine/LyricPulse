import type { AudioAnalysis } from '@lyricpulse/core'
import { normalizeAudioAnalysis } from './normalize'
import { nodeCommandRunner, type CommandRunner } from './runner'

export type AnalyzeAudioOptions = {
  audioPath: string
  runner?: CommandRunner
}

export async function analyzeAudio(
  options: AnalyzeAudioOptions
): Promise<AudioAnalysis> {
  const runner = options.runner ?? nodeCommandRunner
  const [duration, loudness, signalFrames] = await Promise.all([
    readDuration(options.audioPath, runner),
    readIntegratedLoudness(options.audioPath, runner),
    readSignalFrames(options.audioPath, runner)
  ])
  const tempo =
    signalFrames.length > 0 ? estimateTempo(signalFrames) : undefined

  return normalizeAudioAnalysis({
    ...(duration === undefined ? {} : { duration }),
    ...(loudness === undefined ? {} : { loudness }),
    ...(tempo?.bpm === undefined ? {} : { bpm: tempo.bpm }),
    ...(tempo?.beats === undefined ? {} : { beats: tempo.beats }),
    ...(signalFrames.length === 0 ? {} : { frames: signalFrames })
  })
}

export async function readDuration(
  audioPath: string,
  runner: CommandRunner
): Promise<number | undefined> {
  try {
    const result = await runner('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      audioPath
    ])
    const duration = Number(result.stdout.trim())

    return Number.isFinite(duration) && duration > 0 ? duration : undefined
  } catch {
    return undefined
  }
}

export async function readIntegratedLoudness(
  audioPath: string,
  runner: CommandRunner
): Promise<number | undefined> {
  try {
    const result = await runner('ffmpeg', [
      '-i',
      audioPath,
      '-filter:a',
      'ebur128=peak=true',
      '-f',
      'null',
      '-'
    ])

    return parseIntegratedLoudness(result.stderr)
  } catch {
    return undefined
  }
}

export function parseIntegratedLoudness(output: string): number | undefined {
  const summaryIndex = output.lastIndexOf('Integrated loudness:')
  const targetOutput = summaryIndex >= 0 ? output.slice(summaryIndex) : output
  const match = targetOutput.match(/I:\s*(-?\d+(?:\.\d+)?)\s*LUFS/)

  if (!match) {
    return undefined
  }

  const loudness = Number(match[1])

  return Number.isFinite(loudness) ? loudness : undefined
}

export async function readSignalFrames(
  audioPath: string,
  runner: CommandRunner
): Promise<AudioAnalysis['frames']> {
  try {
    const result = await runner('ffmpeg', [
      '-i',
      audioPath,
      '-af',
      'aresample=11025,asetnsamples=n=1102,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
      '-f',
      'null',
      '-'
    ])

    return parseSignalFrames(result.stderr)
  } catch {
    return []
  }
}

export function parseSignalFrames(output: string): AudioAnalysis['frames'] {
  const frameMatches = Array.from(
    output.matchAll(
      /pts_time:(\d+(?:\.\d+)?)[\s\S]*?RMS_level=(-?\d+(?:\.\d+)?)/g
    )
  )
  const rmsValues = frameMatches
    .map((match) => ({ time: Number(match[1]), db: Number(match[2]) }))
    .filter((frame) => Number.isFinite(frame.time) && Number.isFinite(frame.db))

  if (rmsValues.length === 0) {
    return []
  }

  return rmsValues.map((frame, index) => {
    const previous = rmsValues[Math.max(0, index - 1)]
    const next = rmsValues[Math.min(rmsValues.length - 1, index + 1)]
    const rms = dbToUnit(frame.db)
    const attack = Math.max(0, dbToUnit(frame.db) - dbToUnit(previous.db))
    const release = Math.max(0, dbToUnit(frame.db) - dbToUnit(next.db))
    const transient = Math.min(1, (attack + release) * 2.5)

    return {
      time: round(frame.time),
      rms,
      loudness: frame.db,
      bass: clamp(rms * 0.65 + transient * 0.45),
      mid: clamp(rms * 0.5 + attack * 0.8),
      treble: clamp(rms * 0.35 + release * 0.9)
    }
  })
}

function estimateTempo(frames: AudioAnalysis['frames']):
  | {
      bpm: number
      beats: number[]
    }
  | undefined {
  const peaks = frames.filter((frame, index) => {
    const previous = frames[index - 1]
    const next = frames[index + 1]

    return (
      frame.rms > 0.18 &&
      (!previous || frame.rms >= previous.rms) &&
      (!next || frame.rms > next.rms)
    )
  })
  const spacedPeaks = peaks.filter((peak, index) => {
    const previous = peaks[index - 1]

    return !previous || peak.time - previous.time >= 0.28
  })

  if (spacedPeaks.length < 2) {
    return undefined
  }

  const intervals = spacedPeaks
    .slice(1)
    .map((peak, index) => peak.time - spacedPeaks[index].time)
    .filter((interval) => interval >= 0.28 && interval <= 1.5)

  if (intervals.length === 0) {
    return undefined
  }

  const medianInterval = [...intervals].sort((a, b) => a - b)[
    Math.floor(intervals.length / 2)
  ]
  const bpm = clampBpm(60 / medianInterval)

  return {
    bpm: Math.round(bpm),
    beats: spacedPeaks.map((peak) => round(peak.time))
  }
}

function dbToUnit(db: number): number {
  return clamp((db + 60) / 60)
}

function clampBpm(value: number): number {
  let bpm = value

  while (bpm < 70) {
    bpm *= 2
  }

  while (bpm > 190) {
    bpm /= 2
  }

  return bpm
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
