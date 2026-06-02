import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { MultipartFile } from '@fastify/multipart'
import {
  audioFormats,
  coverFormats,
  lyricFormats,
  parseLrc,
  type AssetKind,
  type AssetMetadata,
  type CoverFormat,
  type LyricFormat,
  type Project
} from '@lyricpulse/core'
import { ApiError } from './errors'
import type { ProjectStore } from './projects'

const supportedFormatsByKind = {
  audio: audioFormats,
  lyrics: lyricFormats,
  cover: coverFormats
} as const

export async function saveUploadedAsset(input: {
  storageRoot: string
  store: ProjectStore
  project: Project
  kind: AssetKind
  file: MultipartFile
}): Promise<{ asset: AssetMetadata; project: Project }> {
  const format = getFileFormat(input.file.filename)
  const allowedFormats = supportedFormatsByKind[input.kind]

  if (!allowedFormats.includes(format as never)) {
    throw new ApiError(
      400,
      'UNSUPPORTED_ASSET_FORMAT',
      'Unsupported asset format',
      {
        filename: input.file.filename,
        kind: input.kind,
        supportedFormats: [...allowedFormats]
      }
    )
  }

  const buffer = await input.file.toBuffer()
  const assetId = randomUUID()
  const storedFilename = `${assetId}.${format}`
  const relativePath = join(
    'uploads',
    input.project.id,
    input.kind,
    storedFilename
  )
  const absolutePath = join(input.storageRoot, relativePath)

  await mkdir(
    join(input.storageRoot, 'uploads', input.project.id, input.kind),
    {
      recursive: true
    }
  )
  await writeFile(absolutePath, buffer)

  const asset: AssetMetadata = {
    id: assetId,
    kind: input.kind,
    filename: input.file.filename,
    format: format as AssetMetadata['format'],
    mimeType: input.file.mimetype,
    sizeBytes: buffer.byteLength,
    storagePath: relativePath,
    createdAt: new Date().toISOString()
  }

  const projectWithAsset = await input.store.addAsset(input.project.id, asset)

  if (input.kind !== 'lyrics') {
    return { asset, project: projectWithAsset }
  }

  const lyrics = parseLrc(buffer.toString('utf8'))
  const projectWithLyrics = await input.store.saveProject({
    ...projectWithAsset,
    lyrics: lyrics.lines
  })

  return { asset, project: projectWithLyrics }
}

export function getAssetKind(value: unknown): AssetKind {
  if (value === 'audio' || value === 'lyrics' || value === 'cover') {
    return value
  }

  throw new ApiError(400, 'INVALID_ASSET_KIND', 'Invalid asset kind', {
    supportedKinds: ['audio', 'lyrics', 'cover']
  })
}

export function getFileFormat(
  filename: string
): (typeof audioFormats)[number] | LyricFormat | CoverFormat | string {
  return extname(filename).replace('.', '').toLowerCase()
}
