import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildApp } from './app'

describe('LyricPulse API', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    const storageRoot = await mkdtemp(join(tmpdir(), 'lyricpulse-api-'))
    app = buildApp({ storageRoot })
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
