import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { AssetMetadata, AudioAnalysis, Project } from '@lyricpulse/core'

export type ProjectStore = {
  createProject(input?: {
    title?: string
    artist?: string
    artistEnglish?: string
  }): Promise<Project>
  listProjects(): Promise<Project[]>
  getProject(projectId: string): Promise<Project | undefined>
  saveProject(project: Project): Promise<Project>
  addAsset(projectId: string, asset: AssetMetadata): Promise<Project>
  saveAnalysis(projectId: string, analysis: AudioAnalysis): Promise<Project>
  deleteProject(projectId: string): Promise<boolean>
}

export function createProjectStore(storageRoot: string): ProjectStore {
  const projectsRoot = join(storageRoot, 'projects')

  async function readProject(projectId: string): Promise<Project | undefined> {
    try {
      const content = await readFile(projectPath(projectId), 'utf8')
      return JSON.parse(content) as Project
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return undefined
      }

      throw error
    }
  }

  function projectPath(projectId: string): string {
    return join(projectsRoot, `${projectId}.json`)
  }

  async function writeProject(project: Project): Promise<Project> {
    await mkdir(projectsRoot, { recursive: true })
    await writeFile(projectPath(project.id), JSON.stringify(project, null, 2))
    return project
  }

  return {
    async createProject(input = {}) {
      const now = new Date().toISOString()
      const project: Project = {
        id: randomUUID(),
        ...(input.title ? { title: input.title } : {}),
        ...(input.artist ? { artist: input.artist } : {}),
        ...(input.artistEnglish ? { artistEnglish: input.artistEnglish } : {}),
        assets: [],
        lyrics: [],
        storageProvider: 'local',
        renderProvider: 'local',
        createdAt: now,
        updatedAt: now
      }

      return writeProject(project)
    },
    async listProjects() {
      try {
        const files = await readdir(projectsRoot)
        const projects = await Promise.all(
          files
            .filter((file) => file.endsWith('.json'))
            .map((file) => readProject(file.replace(/\.json$/, '')))
        )

        return projects
          .filter((project): project is Project => Boolean(project))
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      } catch (error) {
        if (
          error instanceof Error &&
          'code' in error &&
          error.code === 'ENOENT'
        ) {
          return []
        }

        throw error
      }
    },
    getProject: readProject,
    async saveProject(project) {
      return writeProject({ ...project, updatedAt: new Date().toISOString() })
    },
    async addAsset(projectId, asset) {
      const project = await readProject(projectId)

      if (!project) {
        throw new Error(`Project ${projectId} was not found`)
      }

      return this.saveProject({
        ...project,
        assets: [...project.assets, asset]
      })
    },
    async saveAnalysis(projectId, analysis) {
      const project = await readProject(projectId)

      if (!project) {
        throw new Error(`Project ${projectId} was not found`)
      }

      return this.saveProject({
        ...project,
        analysis
      })
    },
    async deleteProject(projectId) {
      const project = await readProject(projectId)

      if (!project) {
        return false
      }

      await Promise.all([
        rm(projectPath(projectId), { force: true }),
        rm(join(storageRoot, 'uploads', projectId), {
          recursive: true,
          force: true
        }),
        rm(join(storageRoot, 'preview-audio', projectId), {
          recursive: true,
          force: true
        }),
        rm(join(storageRoot, 'render-jobs', projectId), {
          recursive: true,
          force: true
        }),
        rm(join(storageRoot, 'outputs', projectId), {
          recursive: true,
          force: true
        })
      ])

      return true
    }
  }
}
