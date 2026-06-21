import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  templateDefinitionSchema,
  type TemplateDefinition,
  type TemplateId
} from '@lyricpulse/core'

export type TemplateStore = {
  listTemplates(input?: { includeArchived?: boolean; includeDeleted?: boolean }): Promise<TemplateDefinition[]>
  getTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  createTemplate(input: CreateTemplateInput): Promise<TemplateDefinition>
  saveTemplate(template: TemplateDefinition): Promise<TemplateDefinition>
  publishTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  unpublishTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  trashTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  restoreTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  deleteTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  archiveTemplate(templateId: string): Promise<TemplateDefinition | undefined>
  importTemplate(input: unknown): Promise<TemplateDefinition>
}

export type CreateTemplateInput = {
  name: string
  description?: string
  baseTemplateId: TemplateId
  sourceType?: 'custom' | 'built-in-override'
  template?: Partial<TemplateDefinition>
}

export function createTemplateStore(storageRoot: string): TemplateStore {
  const templatesRoot = join(storageRoot, 'templates')

  function templatePath(templateId: string) {
    return join(templatesRoot, `${templateId}.json`)
  }

  async function readTemplate(templateId: string) {
    try {
      const content = await readFile(templatePath(templateId), 'utf8')
      return templateDefinitionSchema.parse(JSON.parse(content))
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return undefined
      }

      throw error
    }
  }

  async function writeTemplate(template: TemplateDefinition) {
    await mkdir(templatesRoot, { recursive: true })
    await writeFile(templatePath(template.id), JSON.stringify(template, null, 2))
    return template
  }

  async function updateTemplateLifecycle(
    templateId: string,
    update: (template: TemplateDefinition, now: string) => TemplateDefinition
  ) {
    const existing = await readTemplate(templateId)

    if (!existing) {
      return undefined
    }

    const now = new Date().toISOString()
    return writeTemplate(templateDefinitionSchema.parse(update(existing, now)))
  }

  return {
    async listTemplates(input = {}) {
      try {
        const files = await readdir(templatesRoot)
        const templates = await Promise.all(
          files
            .filter((file) => file.endsWith('.json'))
            .map((file) => readTemplate(file.replace(/\.json$/, '')))
        )

        return templates
          .filter((template): template is TemplateDefinition => Boolean(template))
          .filter((template) => input.includeArchived || !template.archivedAt)
          .filter((template) => input.includeDeleted || !template.deletedAt)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          return []
        }

        throw error
      }
    },
    getTemplate: readTemplate,
    async createTemplate(input) {
      const now = new Date().toISOString()
      const sourceType = input.sourceType ?? input.template?.sourceType ?? 'custom'
      const id =
        sourceType === 'built-in-override'
          ? `builtin-${input.baseTemplateId}`
          : randomUUID()
      const existing = await readTemplate(id)

      if (existing) {
        return existing
      }

      const template = templateDefinitionSchema.parse({
        id,
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        schemaVersion: '1.0',
        baseTemplateId: input.baseTemplateId,
        sourceType,
        ratioSettings: input.template?.ratioSettings ?? {},
        ...(input.template?.theme ? { theme: input.template.theme } : {}),
        ...(input.template?.effect ? { effect: input.template.effect } : {}),
        publishedAt: now,
        createdAt: now,
        updatedAt: now
      })

      return writeTemplate(template)
    },
    async saveTemplate(template) {
      const existing = await readTemplate(template.id)
      const parsed = templateDefinitionSchema.parse({
        ...template,
        createdAt: existing?.createdAt ?? template.createdAt,
        updatedAt: new Date().toISOString()
      })

      return writeTemplate(parsed)
    },
    publishTemplate(templateId) {
      return updateTemplateLifecycle(templateId, (template, now) => ({
        ...template,
        publishedAt: now,
        unpublishedAt: undefined,
        updatedAt: now
      }))
    },
    unpublishTemplate(templateId) {
      return updateTemplateLifecycle(templateId, (template, now) => ({
        ...template,
        unpublishedAt: now,
        updatedAt: now
      }))
    },
    trashTemplate(templateId) {
      return updateTemplateLifecycle(templateId, (template, now) => ({
        ...template,
        deletedAt: now,
        archivedAt: now,
        updatedAt: now
      }))
    },
    restoreTemplate(templateId) {
      return updateTemplateLifecycle(templateId, (template, now) => ({
        ...template,
        deletedAt: undefined,
        archivedAt: undefined,
        updatedAt: now
      }))
    },
    async deleteTemplate(templateId) {
      const existing = await readTemplate(templateId)

      if (!existing) {
        return undefined
      }

      try {
        await unlink(templatePath(templateId))
      } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
          throw error
        }
      }

      return existing
    },
    async archiveTemplate(templateId) {
      return updateTemplateLifecycle(templateId, (template, now) => ({
        ...template,
        archivedAt: now,
        deletedAt: now,
        updatedAt: now
      }))
    },
    async importTemplate(input) {
      const parsed = templateDefinitionSchema.parse(input)
      const now = new Date().toISOString()

      return writeTemplate({
        ...parsed,
        id: parsed.id || randomUUID(),
        createdAt: parsed.createdAt || now,
        publishedAt: parsed.publishedAt ?? now,
        updatedAt: now
      })
    }
  }
}
