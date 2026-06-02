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
  const [duration, loudness] = await Promise.all([
    readDuration(options.audioPath, runner),
    readIntegratedLoudness(options.audioPath, runner)
  ])

  return normalizeAudioAnalysis({
    ...(duration === undefined ? {} : { duration }),
    ...(loudness === undefined ? {} : { loudness })
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
