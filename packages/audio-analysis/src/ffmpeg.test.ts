import { describe, expect, it } from 'vitest'
import { analyzeAudio, parseIntegratedLoudness } from './ffmpeg'
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
    const runner: CommandRunner = async (command) => {
      if (command === 'ffprobe') {
        return { stdout: '12.5\n', stderr: '' }
      }

      return {
        stdout: '',
        stderr: 'Integrated loudness:\n    I:         -16.0 LUFS\n'
      }
    }

    const analysis = await analyzeAudio({ audioPath: 'song.mp3', runner })

    expect(analysis.duration).toBe(12.5)
    expect(analysis.frames[0]?.loudness).toBe(-16)
    expect(analysis.unavailableFields).toEqual([
      'bpm',
      'beats',
      'frequencyBands'
    ])
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
