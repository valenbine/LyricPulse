# LyricPulse

LyricPulse is a web application for generating dynamic lyric videos from uploaded audio, LRC lyrics, and cover artwork.

## Planned Stack

- Monorepo: pnpm + Turborepo
- Web Studio: React + Vite + TypeScript
- UI: Tailwind CSS + shadcn/ui + Framer Motion
- API: Node.js + Fastify
- Video: Remotion + FFmpeg
- Shared logic: TypeScript + Zod

## Workspace Layout

```text
apps/web
apps/api
packages/core
packages/video
packages/audio-analysis
storage/uploads
storage/outputs
storage/analysis
```

## Development

```bash
# Install dependencies
pnpm install

# Run all checks
pnpm typecheck
pnpm lint
pnpm test
```
