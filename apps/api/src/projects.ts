import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { AssetMetadata, AudioAnalysis, Project } from '@lyricpulse/core'

export type ProjectStore = {
  createProject(input?: { title?: string; artist?: string }): Promise<Project>
  getProject(projectId: string): Promise<Project | undefined>
  saveProject(project: Project): Promise<Project>
  addAsset(projectId: string, asset: AssetMetadata): Promise<Project>
  saveAnalysis(projectId: string, analysis: AudioAnalysis): Promise<Project>
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
        assets: [],
        lyrics: [],
        storageProvider: 'local',
        renderProvider: 'local',
        createdAt: now,
        updatedAt: now
      }

      return writeProject(project)
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
    }
  }
}
