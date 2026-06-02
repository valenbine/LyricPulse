import { describe, expect, it } from 'vitest'
import { parseLrc } from './lrc'

describe('parseLrc', () => {
  it('parses timestamped lyric lines in chronological order', () => {
    const result = parseLrc('[00:10.50]Second line\n[00:01.00]First line')

    expect(result.issues).toEqual([])
    expect(result.lines).toEqual([
      {
        id: 'lrc-2-1',
        startTime: 1,
        endTime: 10.5,
        text: 'First line'
      },
      {
        id: 'lrc-1-1',
        startTime: 10.5,
        endTime: undefined,
        text: 'Second line'
      }
    ])
  })

  it('preserves source order for duplicate timestamps', () => {
    const result = parseLrc('[00:05.00]Alpha\n[00:05.00]Beta')

    expect(result.lines.map((line) => line.text)).toEqual(['Alpha', 'Beta'])
  })

  it('expands multiple timestamps on one lyric line', () => {
    const result = parseLrc('[00:01.00][00:03.00]Repeated line')

    expect(result.lines).toHaveLength(2)
    expect(result.lines.map((line) => line.startTime)).toEqual([1, 3])
    expect(result.lines.map((line) => line.text)).toEqual([
      'Repeated line',
      'Repeated line'
    ])
  })

  it('reports malformed timestamp line numbers', () => {
    const result = parseLrc('[00:99.00]Bad seconds\n[bad:line]Ignored tag')

    expect(result.lines).toEqual([])
    expect(result.issues).toEqual([
      {
        lineNumber: 1,
        content: '[00:99.00]Bad seconds',
        message: 'Malformed LRC timestamp'
      }
    ])
  })

  it('returns no lines and no issues for empty input', () => {
    expect(parseLrc('')).toEqual({ lines: [], issues: [] })
  })
})
