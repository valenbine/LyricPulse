import { describe, expect, it } from 'vitest'
import {
  analyzeAudio,
  parseIntegratedLoudness,
  parseSignalFrames
} from './ffmpeg'
import type { CommandRunner } from './runner'

describe('ffmpeg audio analysis', () => {
  it('parses integrated loudness from ebur128 output', () => {
    expect(
      parseIntegratedLoudness(`
        Integrated loudness:
          I:         -14.7 LUFS
          Threshold: -24.7 LUFS
      `)
    ).toBe(-14.7)
  })

  it('normalizes duration and loudness from command runner output', async () => {
    const runner: CommandRunner = async (command, args) => {
      if (command === 'ffprobe') {
        return { stdout: '12.5\n', stderr: '' }
      }

      if (args.includes('ebur128=peak=true')) {
        return {
          stdout: '',
          stderr: 'Integrated loudness:\n    I:         -16.0 LUFS\n'
        }
      }

      return {
        stdout: '',
        stderr: `
          frame:0 pts_time:0.000
          lavfi.astats.Overall.RMS_level=-22.0
          frame:1 pts_time:0.500
          lavfi.astats.Overall.RMS_level=-10.0
          frame:2 pts_time:1.000
          lavfi.astats.Overall.RMS_level=-24.0
          frame:3 pts_time:1.500
          lavfi.astats.Overall.RMS_level=-11.0
        `
      }
    }

    const analysis = await analyzeAudio({ audioPath: 'song.mp3', runner })

    expect(analysis.duration).toBe(12.5)
    expect(analysis.frames[0]?.loudness).toBe(-22)
    expect(analysis.bpm).toBeDefined()
    expect(analysis.beats.length).toBeGreaterThan(0)
    expect(analysis.unavailableFields).toBeUndefined()
  })

  it('parses astats RMS frames into music-reactive bands', () => {
    const frames = parseSignalFrames(`
      frame:0 pts_time:0.000
      lavfi.astats.Overall.RMS_level=-30.0
      frame:1 pts_time:0.100
      lavfi.astats.Overall.RMS_level=-12.0
    `)

    expect(frames).toHaveLength(2)
    expect(frames[0]).toMatchObject({ time: 0, loudness: -30 })
    expect(frames[1]?.bass).toBeGreaterThan(frames[0]?.bass ?? 0)
  })

  it('returns partial analysis when commands fail', async () => {
    const runner: CommandRunner = async () => {
      throw new Error('missing binary')
    }

    const analysis = await analyzeAudio({ audioPath: 'song.mp3', runner })

    expect(analysis.duration).toBe(1)
    expect(analysis.unavailableFields).toEqual([
      'bpm',
      'beats',
      'loudness',
      'frequencyBands'
    ])
  })
})
