import { describe, expect, it } from 'vitest'
import { muxVideoWithAudio } from './render-jobs'

describe('muxVideoWithAudio', () => {
  it('combines visual video and uploaded audio with ffmpeg', async () => {
    const calls: Array<{ command: string; args: string[] }> = []

    await muxVideoWithAudio({
      visualVideoPath: '/tmp/render.visual.mp4',
      audioPath: '/tmp/song.mp3',
      outputPath: '/tmp/final/render.mp4',
      commandRunner: async (command, args) => {
        calls.push({ command, args })
        return { stdout: '', stderr: '' }
      }
    })

    expect(calls).toEqual([
      {
        command: 'ffmpeg',
        args: [
          '-y',
          '-i',
          '/tmp/render.visual.mp4',
          '-i',
          '/tmp/song.mp3',
          '-map',
          '0:v:0',
          '-map',
          '1:a:0',
          '-c:v',
          'copy',
          '-c:a',
          'aac',
          '/tmp/final/render.mp4'
        ]
      }
    ])
  })
})
