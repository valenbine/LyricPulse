import { buildApp } from './app'

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '0.0.0.0'
const app = buildApp()

try {
  await app.listen({ port, host })
  app.log.info(`LyricPulse API listening on ${host}:${port}`)
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
