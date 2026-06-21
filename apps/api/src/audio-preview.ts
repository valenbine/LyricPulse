import { mkdir, stat } from 'node:fs/promises'
import { dirname } from 'node:path'
import { nodeCommandRunner } from '@lyricpulse/audio-analysis'

export type PreviewAudioForBrowserFunction = (input: {
  inputPath: string
  outputPath: string
}) => Promise<void>

export const previewAudioForBrowser: PreviewAudioForBrowserFunction = async ({
  inputPath,
  outputPath
}) => {
  await mkdir(dirname(outputPath), { recursive: true })

  try {
    const existing = await stat(outputPath)

    if (existing.isFile() && existing.size > 0) {
      return
    }
  } catch {
    // The preview file does not exist yet.
  }

  await nodeCommandRunner('ffmpeg', [
    '-y',
    '-i',
    inputPath,
    '-vn',
    '-acodec',
    'libmp3lame',
    '-b:a',
    '192k',
    outputPath
  ])
}
