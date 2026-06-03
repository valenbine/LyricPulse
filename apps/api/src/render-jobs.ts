import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  nodeCommandRunner,
  type CommandRunner
} from '@lyricpulse/audio-analysis'
import { renderLyricVideo as defaultRenderLyricVideo } from '@lyricpulse/video/render'
import {
  lyricVideoConfigSchema,
  renderJobSchema,
  templateIdSchema,
  videoRatioSchema,
  type LyricVideoConfig,
  type Project,
  type RenderJob
} from '@lyricpulse/core'
import { ApiError } from './errors'
import type { ProjectStore } from './projects'

export type RenderLyricVideoFunction = typeof defaultRenderLyricVideo
export type MuxVideoWithAudioFunction = typeof muxVideoWithAudio

export async function createRenderJob(input: {
  storageRoot: string
  store: ProjectStore
  project: Project
  body: unknown
  renderLyricVideo?: RenderLyricVideoFunction
  muxVideoWithAudio?: MuxVideoWithAudioFunction
}) {
  const config = buildRenderConfig(input.project, input.body)
  const now = new Date().toISOString()
  const job: RenderJob = {
    id: randomUUID(),
    projectId: input.project.id,
    config,
    status: 'created',
    progress: 0,
    createdAt: now,
    updatedAt: now
  }

  await writeRenderJob(input.storageRoot, job)
  await input.store.saveProject({ ...input.project, config })

  void runRenderJob({
    storageRoot: input.storageRoot,
    project: input.project,
    job,
    renderLyricVideo: input.renderLyricVideo ?? defaultRenderLyricVideo,
    muxVideoWithAudio: input.muxVideoWithAudio ?? muxVideoWithAudio
  })

  return job
}

export async function getRenderJob(input: {
  storageRoot: string
  projectId: string
  jobId: string
}) {
  const job = await readRenderJob(
    input.storageRoot,
    input.projectId,
    input.jobId
  )

  if (!job) {
    throw new ApiError(404, 'RENDER_JOB_NOT_FOUND', 'Render job was not found')
  }

  return job
}

export async function createRenderJobDownload(input: {
  storageRoot: string
  projectId: string
  jobId: string
}) {
  const job = await getRenderJob(input)

  if (job.status !== 'succeeded' || !job.outputPath) {
    throw new ApiError(
      400,
      'RENDER_OUTPUT_NOT_READY',
      'Render output is not ready'
    )
  }

  return {
    filename: basename(job.outputPath),
    buffer: await readFile(join(input.storageRoot, job.outputPath))
  }
}

function buildRenderConfig(project: Project, body: unknown): LyricVideoConfig {
  const parsedBody = renderRequestBodySchema.parse(body ?? {})
  const audioAsset = project.assets.find((asset) => asset.kind === 'audio')
  const coverAsset = project.assets.find((asset) => asset.kind === 'cover')

  if (!audioAsset) {
    throw new ApiError(400, 'AUDIO_ASSET_REQUIRED', 'Audio asset is required')
  }

  if (!coverAsset) {
    throw new ApiError(400, 'COVER_ASSET_REQUIRED', 'Cover asset is required')
  }

  if (project.lyrics.length === 0) {
    throw new ApiError(400, 'LYRICS_REQUIRED', 'Lyrics are required')
  }

  if (!project.analysis) {
    throw new ApiError(
      400,
      'AUDIO_ANALYSIS_REQUIRED',
      'Audio analysis is required'
    )
  }

  return lyricVideoConfigSchema.parse({
    projectId: project.id,
    ratio: parsedBody.ratio,
    templateId: parsedBody.templateId,
    title: parsedBody.title ?? project.title,
    artist: parsedBody.artist ?? project.artist,
    audioAssetId: audioAsset.id,
    coverAssetId: coverAsset.id,
    lyrics: project.lyrics,
    analysis: project.analysis,
    theme: parsedBody.theme,
    effect: parsedBody.effect
  })
}

async function runRenderJob(input: {
  storageRoot: string
  project: Project
  job: RenderJob
  renderLyricVideo: RenderLyricVideoFunction
  muxVideoWithAudio: MuxVideoWithAudioFunction
}) {
  const outputPath = join('outputs', input.job.projectId, `${input.job.id}.mp4`)
  const visualOutputPath = join(
    'outputs',
    input.job.projectId,
    `${input.job.id}.visual.mp4`
  )
  try {
    const audioAsset = input.project.assets.find(
      (asset) => asset.id === input.job.config.audioAssetId
    )

    if (!audioAsset) {
      throw new ApiError(400, 'AUDIO_ASSET_REQUIRED', 'Audio asset is required')
    }

    await writeRenderJob(input.storageRoot, {
      ...input.job,
      status: 'rendering',
      progress: 0.2,
      updatedAt: new Date().toISOString()
    })

    await input.renderLyricVideo({
      config: input.job.config,
      outputLocation: join(input.storageRoot, visualOutputPath)
    })

    await writeRenderJob(input.storageRoot, {
      ...input.job,
      status: 'rendering',
      progress: 0.75,
      updatedAt: new Date().toISOString()
    })

    await input.muxVideoWithAudio({
      visualVideoPath: join(input.storageRoot, visualOutputPath),
      audioPath: join(input.storageRoot, audioAsset.storagePath),
      outputPath: join(input.storageRoot, outputPath)
    })

    await writeRenderJob(input.storageRoot, {
      ...input.job,
      status: 'succeeded',
      progress: 1,
      outputPath,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    await writeRenderJob(input.storageRoot, {
      ...input.job,
      status: 'failed',
      progress: 1,
      failureReason: error instanceof Error ? error.message : 'Render failed',
      updatedAt: new Date().toISOString()
    })
  }
}

export async function muxVideoWithAudio(input: {
  visualVideoPath: string
  audioPath: string
  outputPath: string
  commandRunner?: CommandRunner
}) {
  await mkdir(dirname(input.outputPath), { recursive: true })
  const runner = input.commandRunner ?? nodeCommandRunner

  await runner('ffmpeg', [
    '-y',
    '-i',
    input.visualVideoPath,
    '-i',
    input.audioPath,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-shortest',
    input.outputPath
  ])
}

async function readRenderJob(
  storageRoot: string,
  projectId: string,
  jobId: string
): Promise<RenderJob | undefined> {
  try {
    const content = await readFile(
      renderJobPath(storageRoot, projectId, jobId),
      'utf8'
    )
    return renderJobSchema.parse(JSON.parse(content))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined
    }

    throw error
  }
}

async function writeRenderJob(storageRoot: string, job: RenderJob) {
  await mkdir(join(storageRoot, 'render-jobs', job.projectId), {
    recursive: true
  })
  await writeFile(
    renderJobPath(storageRoot, job.projectId, job.id),
    JSON.stringify(renderJobSchema.parse(job), null, 2)
  )
}

function renderJobPath(storageRoot: string, projectId: string, jobId: string) {
  return join(storageRoot, 'render-jobs', projectId, `${jobId}.json`)
}

const renderRequestBodySchema = lyricVideoConfigSchema
  .pick({
    ratio: true,
    templateId: true,
    title: true,
    artist: true,
    theme: true,
    effect: true
  })
  .extend({
    ratio: videoRatioSchema.default('9:16'),
    templateId: templateIdSchema.default('NeonLyric')
  })
