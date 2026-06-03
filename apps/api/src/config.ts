import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export const defaultStorageRoot = resolve(currentDir, '../../../storage')

export type ApiConfig = {
  storageRoot: string
  analyzeAudio?: typeof import('@lyricpulse/audio-analysis').analyzeAudio
  renderLyricVideo?: typeof import('@lyricpulse/video/render').renderLyricVideo
  muxVideoWithAudio?: typeof import('./render-jobs').muxVideoWithAudio
}

export function createApiConfig(config: Partial<ApiConfig> = {}): ApiConfig {
  return {
    storageRoot: config.storageRoot ?? defaultStorageRoot,
    ...(config.analyzeAudio ? { analyzeAudio: config.analyzeAudio } : {}),
    ...(config.renderLyricVideo
      ? { renderLyricVideo: config.renderLyricVideo }
      : {}),
    ...(config.muxVideoWithAudio
      ? { muxVideoWithAudio: config.muxVideoWithAudio }
      : {})
  }
}
