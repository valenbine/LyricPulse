import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import type { AnalyzeAudioFunction } from './analysis'
import type {
  MuxVideoWithAudioFunction,
  RenderLyricVideoFunction
} from './render-jobs'
import { buildApp } from './app'

describe('LyricPulse API', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    const storageRoot = await mkdtemp(join(tmpdir(), 'lyricpulse-api-'))
    const analyzeAudio: AnalyzeAudioFunction = async () => ({
      duration: 8,
      bpm: 120,
      beats: [0, 0.5, 1],
      frames: [
        {
          time: 0,
          rms: 0.5,
          loudness: -14,
          bass: 0.7,
          mid: 0.5,
          treble: 0.3
        }
      ]
    })
    const renderLyricVideo: RenderLyricVideoFunction = async (input) => {
      await mkdir(dirname(input.outputLocation), { recursive: true })
      await writeFile(input.outputLocation, 'fake visual mp4 bytes')
    }
    const muxVideoWithAudio: MuxVideoWithAudioFunction = async (input) => {
      await mkdir(dirname(input.outputPath), { recursive: true })
      await writeFile(
        input.outputPath,
        `muxed:${input.visualVideoPath}:${input.audioPath}`
      )
    }

    app = buildApp({
      storageRoot,
      analyzeAudio,
      renderLyricVideo,
      muxVideoWithAudio
    })
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('returns health status', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('creates and fetches a project', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        title: 'Pulse Song',
        artist: 'Lyric Artist'
      }
    })

    expect(createResponse.statusCode).toBe(201)
    const createdProject = createResponse.json().project

    expect(createdProject).toMatchObject({
      title: 'Pulse Song',
      artist: 'Lyric Artist',
      assets: [],
      lyrics: [],
      storageProvider: 'local',
      renderProvider: 'local'
    })

    const fetchResponse = await app.inject({
      method: 'GET',
      url: `/api/projects/${createdProject.id}`
    })

    expect(fetchResponse.statusCode).toBe(200)
    expect(fetchResponse.json().project.id).toBe(createdProject.id)
  })

  it('uploads LRC assets and exposes parsed lyric timeline', async () => {
    const project = await createProject()
    const body = createMultipartBody({
      kind: 'lyrics',
      filename: 'song.lrc',
      content: '[00:01.00]First line\n[00:03.50]Second line'
    })

    const uploadResponse = await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/assets`,
      headers: body.headers,
      payload: body.payload
    })

    expect(uploadResponse.statusCode).toBe(201)
    const result = uploadResponse.json()

    expect(result.asset).toMatchObject({
      kind: 'lyrics',
      filename: 'song.lrc',
      format: 'lrc',
      sizeBytes: 42
    })
    expect(result.project.lyrics).toEqual([
      {
        id: 'lrc-1-1',
        startTime: 1,
        endTime: 3.5,
        text: 'First line'
      },
      {
        id: 'lrc-2-1',
        startTime: 3.5,
        text: 'Second line'
      }
    ])
  })

  it('rejects unsupported asset formats', async () => {
    const project = await createProject()
    const body = createMultipartBody({
      kind: 'audio',
      filename: 'song.txt',
      content: 'not audio'
    })

    const response = await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/assets`,
      headers: body.headers,
      payload: body.payload
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({
      code: 'UNSUPPORTED_ASSET_FORMAT',
      message: 'Unsupported asset format'
    })
  })

  it('analyzes uploaded audio and stores analysis on the project', async () => {
    const project = await createProject()
    await uploadAsset({
      projectId: project.id,
      kind: 'audio',
      filename: 'song.mp3',
      content: 'fake audio bytes'
    })

    const response = await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/analyze`
    })

    expect(response.statusCode).toBe(200)
    const result = response.json()

    expect(result.analysis).toMatchObject({
      duration: 8,
      bpm: 120,
      beats: [0, 0.5, 1]
    })
    expect(result.project.analysis).toMatchObject({ duration: 8, bpm: 120 })
  })

  it('requires an audio asset before analysis', async () => {
    const project = await createProject()

    const response = await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/analyze`
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      code: 'AUDIO_ASSET_REQUIRED',
      message: 'Audio asset is required'
    })
  })

  it('creates render jobs and exposes finished MP4 downloads', async () => {
    const project = await createProject()
    await uploadAsset({
      projectId: project.id,
      kind: 'audio',
      filename: 'song.mp3',
      content: 'fake audio bytes'
    })
    await uploadAsset({
      projectId: project.id,
      kind: 'lyrics',
      filename: 'song.lrc',
      content: '[00:01.00]First line\n[00:03.50]Second line'
    })
    await uploadAsset({
      projectId: project.id,
      kind: 'cover',
      filename: 'cover.png',
      content: 'fake cover bytes'
    })
    await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/analyze`
    })

    const createResponse = await app.inject({
      method: 'POST',
      url: `/api/projects/${project.id}/render`,
      payload: {
        ratio: '9:16',
        templateId: 'NeonLyric',
        theme: {
          primaryColor: '#8B5CF6',
          accentColor: '#22C55E',
          backgroundIntensity: 0.85,
          fontFamily: 'Poppins, sans-serif'
        },
        effect: {
          lyricGlow: 0.8,
          pulseIntensity: 0.75,
          beatImpact: 0.7
        }
      }
    })

    expect(createResponse.statusCode).toBe(201)
    const createdJob = createResponse.json().job

    expect(createdJob).toMatchObject({
      projectId: project.id,
      status: 'created',
      progress: 0,
      config: {
        ratio: '9:16',
        templateId: 'NeonLyric'
      }
    })

    const finishedJob = await waitForRenderJob(project.id, createdJob.id)

    expect(finishedJob).toMatchObject({
      status: 'succeeded',
      progress: 1
    })

    const downloadResponse = await app.inject({
      method: 'GET',
      url: `/api/projects/${project.id}/render/${createdJob.id}/download`
    })

    expect(downloadResponse.statusCode).toBe(200)
    expect(downloadResponse.headers['content-type']).toContain('video/mp4')
    expect(downloadResponse.body).toContain('.visual.mp4')
    expect(downloadResponse.body).toContain('/uploads/')
  })

  it('returns not found for unknown projects', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/projects/missing-project'
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      code: 'PROJECT_NOT_FOUND',
      message: 'Project was not found'
    })
  })

  async function createProject() {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {}
    })

    return response.json().project as { id: string }
  }

  async function uploadAsset(input: {
    projectId: string
    kind: string
    filename: string
    content: string
  }) {
    const body = createMultipartBody(input)

    return app.inject({
      method: 'POST',
      url: `/api/projects/${input.projectId}/assets`,
      headers: body.headers,
      payload: body.payload
    })
  }

  async function waitForRenderJob(projectId: string, jobId: string) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await app.inject({
        method: 'GET',
        url: `/api/projects/${projectId}/render/${jobId}`
      })
      const job = response.json().job

      if (job.status === 'succeeded' || job.status === 'failed') {
        return job
      }

      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    throw new Error('Render job did not finish')
  }
})

function createMultipartBody(input: {
  kind: string
  filename: string
  content: string
}) {
  const boundary = `----lyricpulse-${Date.now()}`
  const payload = Buffer.from(
    [
      `--${boundary}`,
      'Content-Disposition: form-data; name="kind"',
      '',
      input.kind,
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${input.filename}"`,
      'Content-Type: application/octet-stream',
      '',
      input.content,
      `--${boundary}--`,
      ''
    ].join('\r\n')
  )

  return {
    headers: {
      'content-type': `multipart/form-data; boundary=${boundary}`,
      'content-length': payload.byteLength.toString()
    },
    payload
  }
}
