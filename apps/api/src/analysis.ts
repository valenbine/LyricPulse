import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { analyzeAudio as defaultAnalyzeAudio } from '@lyricpulse/audio-analysis'
import {
  audioAnalysisSchema,
  type AudioAnalysis,
  type Project
} from '@lyricpulse/core'
import { ApiError } from './errors'
import type { ProjectStore } from './projects'

export type AnalyzeAudioFunction = typeof defaultAnalyzeAudio

export async function analyzeProjectAudio(input: {
  storageRoot: string
  store: ProjectStore
  project: Project
  analyzeAudio?: AnalyzeAudioFunction
}): Promise<{ analysis: AudioAnalysis; project: Project }> {
  const audioAsset = input.project.assets.find(
    (asset) => asset.kind === 'audio'
  )

  if (!audioAsset) {
    throw new ApiError(400, 'AUDIO_ASSET_REQUIRED', 'Audio asset is required')
  }

  const analyzer = input.analyzeAudio ?? defaultAnalyzeAudio
  const audioPath = join(input.storageRoot, audioAsset.storagePath)
  const analysis = audioAnalysisSchema.parse(await analyzer({ audioPath }))
  const analysisPath = join(input.storageRoot, 'analysis', input.project.id)

  await mkdir(analysisPath, { recursive: true })
  await writeFile(
    join(analysisPath, 'audio-analysis.json'),
    JSON.stringify(analysis, null, 2)
  )

  const project = await input.store.saveAnalysis(input.project.id, analysis)

  return { analysis, project }
}
