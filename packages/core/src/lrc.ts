import type { LrcParseIssue, LrcParseResult, LyricLine } from './types'

const timestampPattern = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g
const anyBracketedTimestampPattern = /\[[^\]]*\d+:[^\]]*\]/

export function parseLrc(input: string): LrcParseResult {
  const issues: LrcParseIssue[] = []
  const parsedLines: Array<LyricLine & { sourceIndex: number }> = []
  const sourceLines = input.split(/\r?\n/)

  sourceLines.forEach((sourceLine, sourceIndex) => {
    const lineNumber = sourceIndex + 1
    const matches = [...sourceLine.matchAll(timestampPattern)]

    if (matches.length === 0) {
      const trimmed = sourceLine.trim()

      if (trimmed.length > 0 && anyBracketedTimestampPattern.test(trimmed)) {
        issues.push({
          lineNumber,
          content: sourceLine,
          message: 'Malformed LRC timestamp'
        })
      }

      return
    }

    const lyricText = sourceLine.replace(timestampPattern, '').trim()

    matches.forEach((match, matchIndex) => {
      const startTime = timestampToSeconds(match)

      if (startTime === undefined) {
        issues.push({
          lineNumber,
          content: sourceLine,
          message: 'Malformed LRC timestamp'
        })
        return
      }

      parsedLines.push({
        id: `lrc-${lineNumber}-${matchIndex + 1}`,
        startTime,
        text: lyricText,
        sourceIndex
      })
    })
  })

  const sortedLines = [...parsedLines]
    .sort((left, right) => {
      if (left.startTime !== right.startTime) {
        return left.startTime - right.startTime
      }

      return left.sourceIndex - right.sourceIndex
    })
    .map((line, index, lines) => {
      const { sourceIndex, ...lyricLine } = line
      void sourceIndex

      return {
        ...lyricLine,
        endTime: lines[index + 1]?.startTime
      }
    })

  return {
    lines: sortedLines,
    issues
  }
}

function timestampToSeconds(match: RegExpMatchArray): number | undefined {
  const minutes = Number(match[1])
  const seconds = Number(match[2])
  const fraction = match[3] ?? '0'

  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    seconds > 59
  ) {
    return undefined
  }

  const milliseconds = Number(fraction.padEnd(3, '0'))

  return minutes * 60 + seconds + milliseconds / 1000
}
