import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from '@remotion/bundler'
import {
  makeCancelSignal,
  renderMedia,
  selectComposition
} from '@remotion/renderer'
import type { RenderMediaOnProgress } from '@remotion/renderer'
import type { LyricVideoConfig } from '@lyricpulse/core'
import { getCompositionId, getRenderDimensions } from './dimensions'
import { getDurationInFrames } from './helpers'

const currentDir = dirname(fileURLToPath(import.meta.url))

export type RenderLyricVideoInput = {
  config: LyricVideoConfig
  outputLocation: string
  onProgress?: (progress: number) => void | Promise<void>
  onCancel?: (cancel: () => void) => void
}

export async function renderLyricVideo(input: RenderLyricVideoInput) {
  await mkdir(dirname(input.outputLocation), { recursive: true })

  const entryPoint = resolve(currentDir, 'register.tsx')
  const serveUrl = await bundle({ entryPoint })
  const compositionId = getCompositionId(
    input.config.templateId,
    input.config.ratio
  )
  const inputProps = { config: input.config }
  const { cancelSignal, cancel } = makeCancelSignal()
  input.onCancel?.(cancel)
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps
  })

  await renderMedia({
    serveUrl,
    composition: {
      ...composition,
      ...getRenderDimensions(input.config.ratio),
      durationInFrames: getDurationInFrames(input.config, composition.fps)
    },
    codec: 'h264',
    concurrency: 1,
    outputLocation: input.outputLocation,
    inputProps,
    cancelSignal,
    onProgress: async ({ progress }: Parameters<RenderMediaOnProgress>[0]) => {
      if (typeof progress === 'number') {
        await input.onProgress?.(progress)
      }
    }
  })
}
