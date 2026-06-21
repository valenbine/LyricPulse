import { buildApp } from './app'

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '0.0.0.0'
const keepaliveIntervalMs = Number(process.env.DEV_KEEPALIVE_INTERVAL_MS ?? 120000)
const app = buildApp({
  ...(process.env.WEB_DIST_ROOT
    ? { webDistRoot: process.env.WEB_DIST_ROOT }
    : {})
})

try {
  await app.listen({ port, host })
  app.log.info(`LyricPulse API listening on ${host}:${port}`)

  if (Number.isFinite(keepaliveIntervalMs) && keepaliveIntervalMs > 0) {
    setInterval(() => {
      void fetch(`http://127.0.0.1:${port}/health`).catch(() => undefined)
    }, keepaliveIntervalMs)
    app.log.info(`LyricPulse keepalive enabled every ${keepaliveIntervalMs}ms`)
  }
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
