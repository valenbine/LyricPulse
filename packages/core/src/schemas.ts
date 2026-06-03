import { z } from 'zod'
import {
  audioFormats,
  coverFormats,
  lyricFormats,
  renderJobStatuses,
  templateIds,
  videoRatios
} from './types'

const isoDateSchema = z.string().datetime({ offset: true })
const idSchema = z.string().min(1)

export const assetKindSchema = z.enum(['audio', 'lyrics', 'cover'])
export const audioFormatSchema = z.enum(audioFormats)
export const lyricFormatSchema = z.enum(lyricFormats)
export const coverFormatSchema = z.enum(coverFormats)
export const videoRatioSchema = z.enum(videoRatios)
export const templateIdSchema = z.enum(templateIds)
export const renderJobStatusSchema = z.enum(renderJobStatuses)

export const assetMetadataSchema = z.object({
  id: idSchema,
  kind: assetKindSchema,
  filename: z.string().min(1),
  format: z.union([audioFormatSchema, lyricFormatSchema, coverFormatSchema]),
  mimeType: z.string().min(1).optional(),
  sizeBytes: z.number().int().nonnegative(),
  storagePath: z.string().min(1),
  createdAt: isoDateSchema
})

export const lyricLineSchema = z.object({
  id: idSchema,
  startTime: z.number().nonnegative(),
  endTime: z.number().nonnegative().optional(),
  text: z.string()
})

export const audioAnalysisFrameSchema = z.object({
  time: z.number().nonnegative(),
  rms: z.number().nonnegative(),
  loudness: z.number(),
  bass: z.number().nonnegative(),
  mid: z.number().nonnegative(),
  treble: z.number().nonnegative()
})

export const audioAnalysisSchema = z.object({
  duration: z.number().positive(),
  bpm: z.number().positive().optional(),
  beats: z.array(z.number().nonnegative()),
  frames: z.array(audioAnalysisFrameSchema),
  unavailableFields: z
    .array(z.enum(['bpm', 'beats', 'loudness', 'frequencyBands']))
    .optional()
})

export const lyricVideoThemeSchema = z.object({
  primaryColor: z.string().min(1),
  accentColor: z.string().min(1),
  backgroundIntensity: z.number().min(0).max(1),
  fontFamily: z.string().min(1)
})

export const lyricVideoEffectSchema = z.object({
  lyricGlow: z.number().min(0).max(1),
  pulseIntensity: z.number().min(0).max(1),
  beatImpact: z.number().min(0).max(1)
})

export const lyricVideoConfigSchema = z.object({
  projectId: idSchema,
  ratio: videoRatioSchema,
  templateId: templateIdSchema,
  title: z.string().min(1).optional(),
  artist: z.string().min(1).optional(),
  audioAssetId: idSchema,
  coverAssetId: idSchema,
  lyrics: z.array(lyricLineSchema),
  analysis: audioAnalysisSchema,
  theme: lyricVideoThemeSchema,
  effect: lyricVideoEffectSchema
})

export const uploadMetadataSchema = z.object({
  kind: assetKindSchema,
  filename: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  mimeType: z.string().min(1).optional()
})

export const projectSchema = z.object({
  id: idSchema,
  title: z.string().min(1).optional(),
  artist: z.string().min(1).optional(),
  assets: z.array(assetMetadataSchema),
  lyrics: z.array(lyricLineSchema),
  analysis: audioAnalysisSchema.optional(),
  config: lyricVideoConfigSchema.optional(),
  storageProvider: z.enum(['local']),
  renderProvider: z.enum(['local']),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema
})

export const renderJobSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  config: lyricVideoConfigSchema,
  status: renderJobStatusSchema,
  progress: z.number().min(0).max(1),
  outputPath: z.string().min(1).optional(),
  failureReason: z.string().min(1).optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema
})

export const renderJobRequestSchema = z.object({
  projectId: idSchema,
  config: lyricVideoConfigSchema
})
