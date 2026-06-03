import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import type { LyricVideoConfig } from '@lyricpulse/core'
import { getCompositionId } from './dimensions'

const currentDir = dirname(fileURLToPath(import.meta.url))

export type RenderLyricVideoInput = {
  config: LyricVideoConfig
  outputLocation: string
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
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps
  })

  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: input.outputLocation,
    inputProps
  })
}
