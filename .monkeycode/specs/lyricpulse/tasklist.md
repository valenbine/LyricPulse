# LyricPulse Implementation Task List

Feature Name: lyricpulse
Updated: 2026-06-02

## Phase 1: Monorepo Foundation

1. [x] Initialize pnpm workspace with `apps/web`, `apps/api`, `packages/core`, `packages/video`, and `packages/audio-analysis`.
2. [x] Add Turborepo task orchestration for development, build, lint, test, and typecheck.
3. [x] Configure TypeScript base settings and package-level build outputs.
4. [x] Add ESLint and Prettier configuration shared across the monorepo.
5. [x] Create local `storage/uploads` and `storage/outputs` path conventions in configuration.

## Phase 2: Shared Core Package

1. [x] Define shared types for assets, projects, lyric lines, audio analysis, templates, ratios, and render jobs.
2. [x] Add Zod schemas for upload metadata, project configuration, template settings, and render job requests.
3. [x] Implement LRC parser with line ordering, duplicate timestamp preservation, malformed line reporting, and empty file handling.
4. [x] Add unit tests for parser and schemas.

## Phase 3: API Service

1. Create Fastify API service with health check and JSON error payload conventions.
2. Implement project creation and local metadata persistence.
3. Implement multipart upload endpoints for audio, LRC, and cover assets.
4. Connect upload validation to supported audio, lyrics, and image formats.
5. Expose parsed lyric timeline and project status endpoints.

## Phase 4: Audio Analysis

1. Implement audio analysis adapter interface for duration, BPM, beats, loudness, and simplified frequency bands.
2. Add FFmpeg-based duration and loudness extraction.
3. Add beat and simplified bass/mid/treble analysis using replaceable adapters.
4. Store normalized `AudioAnalysis` JSON per project.
5. Add tests for analysis JSON normalization and partial failure handling.

## Phase 5: Remotion Video Package

1. Configure Remotion in `packages/video`.
2. Implement shared template input contract using `LyricVideoConfig`.
3. Build `PulseCover` with cover breathing, lyric pulse, and beat impact.
4. Build `NeonLyric` with glowing lyrics, animated gradients, and music-reactive intensity.
5. Build `WaveformStage` with waveform stage layout, blurred cover background, and lyric progression.
6. Support both `9:16` and `16:9` dimensions in every template.
7. Add smoke tests or render checks for each template and ratio.

## Phase 6: Web Studio

1. Create React + Vite + TypeScript app.
2. Install and configure Tailwind CSS, shadcn/ui, and Framer Motion.
3. Configure Vite proxy for `/api` and allowed hosts for `.monkeycode-ai.online`.
4. Build Landing / Studio entry page with deep music workstation visual style.
5. Build upload flow for audio, LRC, and cover assets with validation feedback.
6. Build editor layout with template selector, ratio selector, theme controls, preview canvas, lyric timeline, and audio analysis status.
7. Build render result view with MP4 preview, download action, and return-to-edit action.

## Phase 7: Rendering Workflow

1. Implement render job creation in the API.
2. Invoke Remotion Renderer with project configuration and selected template.
3. Compose generated visuals with source audio into MP4 output.
4. Track render job status and progress for the Studio.
5. Expose output metadata and download endpoint.
6. Add retry handling for failed render jobs.

## Phase 8: Verification And Polish

1. Run monorepo lint, typecheck, tests, and build.
2. Run local end-to-end smoke flow with sample audio, LRC, and cover files.
3. Verify both `9:16` and `16:9` MP4 export.
4. Verify the three templates respond to audio analysis data.
5. Add README setup instructions for local open-source usage.
6. Document SaaS extension points for storage provider, render provider, job queue, and user history.
