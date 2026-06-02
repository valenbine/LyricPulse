import multipart from '@fastify/multipart'
import type { Multipart } from '@fastify/multipart'
import Fastify from 'fastify'
import { z } from 'zod'
import { projectSchema } from '@lyricpulse/core'
import { createApiConfig, type ApiConfig } from './config'
import { ApiError, createErrorPayload } from './errors'
import { createProjectStore } from './projects'
import { getAssetKind, saveUploadedAsset } from './uploads'

const createProjectBodySchema = z.object({
  title: z.string().min(1).optional(),
  artist: z.string().min(1).optional()
})

export function buildApp(config: Partial<ApiConfig> = {}) {
  const apiConfig = createApiConfig(config)
  const store = createProjectStore(apiConfig.storageRoot)
  const app = Fastify({ logger: false })

  app.register(multipart, {
    limits: {
      fileSize: 250 * 1024 * 1024,
      files: 1
    }
  })

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApiError) {
      reply.code(error.statusCode).send(createErrorPayload(error))
      return
    }

    if (error instanceof z.ZodError) {
      reply.code(400).send({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.issues
      })
      return
    }

    reply.code(500).send({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error'
    })
  })

  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/api/projects', async (request, reply) => {
    const input = createProjectBodySchema.parse(request.body ?? {})
    const project = await store.createProject(input)

    reply.code(201).send({ project: projectSchema.parse(project) })
  })

  app.get('/api/projects/:projectId', async (request) => {
    const params = z
      .object({ projectId: z.string().min(1) })
      .parse(request.params)
    const project = await store.getProject(params.projectId)

    if (!project) {
      throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project was not found')
    }

    return { project: projectSchema.parse(project) }
  })

  app.post('/api/projects/:projectId/assets', async (request, reply) => {
    const params = z
      .object({ projectId: z.string().min(1) })
      .parse(request.params)
    const project = await store.getProject(params.projectId)

    if (!project) {
      throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project was not found')
    }

    const file = await request.file()

    if (!file) {
      throw new ApiError(400, 'ASSET_FILE_REQUIRED', 'Asset file is required')
    }

    const kind = getAssetKind(readMultipartFieldValue(file.fields.kind))
    const result = await saveUploadedAsset({
      storageRoot: apiConfig.storageRoot,
      store,
      project,
      kind,
      file
    })

    reply.code(201).send({
      asset: result.asset,
      project: projectSchema.parse(result.project)
    })
  })

  return app
}

function readMultipartFieldValue(field: Multipart | Multipart[] | undefined) {
  const firstField = Array.isArray(field) ? field[0] : field

  if (firstField && 'value' in firstField) {
    return firstField.value
  }

  return undefined
}
