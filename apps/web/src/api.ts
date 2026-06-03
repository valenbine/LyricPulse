import type {
  AssetKind,
  AudioAnalysis,
  LyricVideoEffect,
  LyricVideoTheme,
  Project,
  RenderJob,
  TemplateId,
  VideoRatio
} from '@lyricpulse/core'

type ProjectResponse = {
  project: Project
}

type AnalysisResponse = ProjectResponse & {
  analysis: AudioAnalysis
}

type RenderJobResponse = {
  job: RenderJob
}

export async function createProject(input: { title: string; artist: string }) {
  return request<ProjectResponse>('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: input.title || undefined,
      artist: input.artist || undefined
    })
  })
}

export async function uploadAsset(
  projectId: string,
  kind: AssetKind,
  file: File
) {
  const formData = new FormData()
  formData.append('kind', kind)
  formData.append('file', file)

  return request<ProjectResponse>(`/api/projects/${projectId}/assets`, {
    method: 'POST',
    body: formData
  })
}

export async function analyzeProject(projectId: string) {
  return request<AnalysisResponse>(`/api/projects/${projectId}/analyze`, {
    method: 'POST'
  })
}

export async function createRenderJob(
  projectId: string,
  input: {
    ratio: VideoRatio
    templateId: TemplateId
    title: string
    artist: string
    theme: LyricVideoTheme
    effect: LyricVideoEffect
  }
) {
  return request<RenderJobResponse>(`/api/projects/${projectId}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
}

export async function getRenderJob(projectId: string, jobId: string) {
  return request<RenderJobResponse>(
    `/api/projects/${projectId}/render/${jobId}`
  )
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  const payload = (await response.json().catch(() => null)) as unknown

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload as T
}
