import { Player, type PlayerRef } from '@remotion/player'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getDurationInFrames,
  getRenderDimensions,
  getTemplateComponent,
} from '@lyricpulse/video'
import type { LyricVideoConfig } from '@lyricpulse/core'
import { cn } from '../lib/utils'

const FPS = 24

export function RemotionPreview({ config }: { config: LyricVideoConfig }) {
  const dimensions = getRenderDimensions(config.ratio)
  const TemplateComponent = getTemplateComponent(config.templateId)
  const durationInFrames = getDurationInFrames(config, FPS)
  const durationInSeconds = useMemo(() => durationInFrames / FPS, [durationInFrames])
  const playerConfig = { ...config, audioUrl: undefined }
  const visualSignature = [config.projectId, config.templateId, config.ratio].join(':')

  const playerRef = useRef<PlayerRef>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const requestIdRef = useRef(0)
  const startTimeRef = useRef(0)
  const pausedTimeRef = useRef(0)
  const committedFrameRef = useRef(0)
  const desiredFrameRef = useRef(0)
  const isDraggingRef = useRef(false)
  const resumeAfterDragRef = useRef(false)
  const suppressClickRef = useRef(false)
  const activeDragSessionRef = useRef(0)
  const isStoppingSourceRef = useRef(false)
  const previousAudioUrlRef = useRef<string | undefined>(undefined)
  const previousProjectIdRef = useRef<string | undefined>(undefined)
  const previousVisualSignatureRef = useRef<string | undefined>(undefined)

  const [currentFrame, setCurrentFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(!config.audioUrl)

  const clampFrame = (frame: number) =>
    Math.max(0, Math.min(durationInFrames - 1, Math.round(frame)))

  const getAudioDuration = () => audioBufferRef.current?.duration ?? durationInSeconds

  const syncPlayerFrame = (frame: number) => {
    playerRef.current?.seekTo(frame)
  }

  const updateDisplayedFrame = (frame: number) => {
    const clampedFrame = clampFrame(frame)
    setCurrentFrame(clampedFrame)
    syncPlayerFrame(clampedFrame)
  }

  const stopSourceNode = () => {
    const source = sourceNodeRef.current

    if (!source) {
      return
    }

    isStoppingSourceRef.current = true
    source.onended = null
    source.stop()
    source.disconnect()
    sourceNodeRef.current = null
    isStoppingSourceRef.current = false
  }

  const getOrCreateAudioContext = async () => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      return audioContextRef.current
    }

    const context = new AudioContext()
    audioContextRef.current = context
    return context
  }

  const getPlaybackSeconds = () => {
    if (isPlaying && audioContextRef.current) {
      return Math.max(0, audioContextRef.current.currentTime - startTimeRef.current)
    }

    return pausedTimeRef.current
  }

  const stopRafLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const syncFrameFromPlayback = () => {
    if (isDraggingRef.current) {
      return
    }

    const nextFrame = clampFrame(getPlaybackSeconds() * FPS)

    if (nextFrame !== committedFrameRef.current) {
      committedFrameRef.current = nextFrame
      desiredFrameRef.current = nextFrame
      updateDisplayedFrame(nextFrame)
    }
  }

  const startRafLoop = () => {
    stopRafLoop()

    const tick = () => {
      syncFrameFromPlayback()
      if (sourceNodeRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const setTargetFrame = (frame: number, options?: { previewOnly?: boolean }) => {
    const clampedFrame = clampFrame(frame)
    desiredFrameRef.current = clampedFrame

    if (options?.previewOnly) {
      setDragFrame(clampedFrame)
      updateDisplayedFrame(clampedFrame)
      return
    }

    committedFrameRef.current = clampedFrame
    pausedTimeRef.current = clampedFrame / FPS
    setDragFrame(null)
    updateDisplayedFrame(clampedFrame)
  }

  const pausePlayback = () => {
    pausedTimeRef.current = Math.min(getPlaybackSeconds(), getAudioDuration())
    setIsPlaying(false)
    stopRafLoop()
    stopSourceNode()
  }

  const playFromDesiredFrame = async () => {
    const buffer = audioBufferRef.current

    if (!buffer) {
      setIsPlaying(false)
      return
    }

    const context = await getOrCreateAudioContext()
    const targetSeconds = Math.min(desiredFrameRef.current / FPS, Math.max(buffer.duration - 0.001, 0))

    stopSourceNode()

    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.onended = () => {
      if (isStoppingSourceRef.current || sourceNodeRef.current !== source) {
        return
      }

      source.disconnect()
      sourceNodeRef.current = null
      setIsPlaying(false)
      stopRafLoop()
      pausedTimeRef.current = 0
      desiredFrameRef.current = 0
      committedFrameRef.current = 0
      setDragFrame(null)
      updateDisplayedFrame(0)
    }

    sourceNodeRef.current = source
    startTimeRef.current = context.currentTime - targetSeconds
    pausedTimeRef.current = targetSeconds
    committedFrameRef.current = clampFrame(targetSeconds * FPS)
    desiredFrameRef.current = committedFrameRef.current
    updateDisplayedFrame(committedFrameRef.current)
    source.start(0, targetSeconds)
    setIsPlaying(true)
    startRafLoop()
  }

  useEffect(() => {
    return () => {
      stopRafLoop()
      stopSourceNode()
      void audioContextRef.current?.close()
      audioContextRef.current = null
    }
  }, [])

  useEffect(() => {
    const nextRequestId = requestIdRef.current + 1
    requestIdRef.current = nextRequestId
    const currentAudioUrl = config.audioUrl
    const previousAudioUrl = previousAudioUrlRef.current
    previousAudioUrlRef.current = currentAudioUrl

    if (previousAudioUrl === currentAudioUrl) {
      return
    }

    pausePlayback()
    audioBufferRef.current = null
    setIsAudioReady(!currentAudioUrl)

    const previousProjectId = previousProjectIdRef.current
    previousProjectIdRef.current = config.projectId
    const targetFrame =
      previousProjectId && previousProjectId !== config.projectId ? 0 : committedFrameRef.current

    desiredFrameRef.current = targetFrame
    committedFrameRef.current = targetFrame
    pausedTimeRef.current = targetFrame / FPS
    setDragFrame(null)
    updateDisplayedFrame(targetFrame)

    if (!currentAudioUrl) {
      return
    }

    void (async () => {
      const context = await getOrCreateAudioContext()
      const response = await fetch(currentAudioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const decoded = await context.decodeAudioData(arrayBuffer.slice(0))

      if (requestIdRef.current !== nextRequestId) {
        return
      }

      audioBufferRef.current = decoded
      pausedTimeRef.current = Math.min(targetFrame / FPS, decoded.duration)
      setIsAudioReady(true)
    })().catch(() => {
      if (requestIdRef.current !== nextRequestId) {
        return
      }

      setIsAudioReady(false)
    })
  }, [config.audioUrl, config.projectId])

  useEffect(() => {
    const player = playerRef.current

    if (!player) {
      return
    }

    const previousVisualSignature = previousVisualSignatureRef.current
    previousVisualSignatureRef.current = visualSignature

    if (!previousVisualSignature || previousVisualSignature === visualSignature) {
      return
    }

    syncPlayerFrame(dragFrame ?? currentFrame)
  }, [currentFrame, dragFrame, visualSignature])

  const togglePlayback = () => {
    if (isPlaying) {
      pausePlayback()
      return
    }

    void playFromDesiredFrame()
  }

  const getFrameFromClientX = (clientX: number) => {
    const track = trackRef.current

    if (!track) {
      return desiredFrameRef.current
    }

    const rect = track.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)

    return clampFrame(ratio * Math.max(durationInFrames - 1, 0))
  }

  const beginDrag = () => {
    activeDragSessionRef.current += 1
    isDraggingRef.current = true
    resumeAfterDragRef.current = isPlaying
    suppressClickRef.current = true
    pausePlayback()
  }

  const finishDrag = () => {
    if (!isDraggingRef.current) {
      return
    }

    isDraggingRef.current = false
    setTargetFrame(desiredFrameRef.current)

    if (resumeAfterDragRef.current) {
      resumeAfterDragRef.current = false
      void playFromDesiredFrame()
      return
    }

    resumeAfterDragRef.current = false
  }

  const handleTrackPress = (clientX: number) => {
    beginDrag()
    const dragSession = activeDragSessionRef.current
    setTargetFrame(getFrameFromClientX(clientX), { previewOnly: true })

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || dragSession !== activeDragSessionRef.current) {
        return
      }

      setTargetFrame(getFrameFromClientX(moveEvent.clientX), { previewOnly: true })
    }

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isDraggingRef.current || dragSession !== activeDragSessionRef.current) {
        return
      }

      const touch = moveEvent.touches[0]

      if (!touch) {
        return
      }

      moveEvent.preventDefault()
      setTargetFrame(getFrameFromClientX(touch.clientX), { previewOnly: true })
    }

    const cleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchCancel)
    }

    const handleMouseUp = () => {
      if (dragSession === activeDragSessionRef.current) {
        activeDragSessionRef.current += 1
      }

      cleanup()
      finishDrag()
    }

    const handleTouchEnd = () => {
      if (dragSession === activeDragSessionRef.current) {
        activeDragSessionRef.current += 1
      }

      cleanup()
      finishDrag()
    }

    const handleTouchCancel = () => {
      if (dragSession === activeDragSessionRef.current) {
        activeDragSessionRef.current += 1
      }

      cleanup()
      isDraggingRef.current = false
      setDragFrame(null)
      updateDisplayedFrame(committedFrameRef.current)
      resumeAfterDragRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchCancel)
  }

  const handleDirectSeek = (frame: number) => {
    setTargetFrame(frame)

    if (isPlaying) {
      void playFromDesiredFrame()
    }
  }

  const formattedCurrentTime = formatPreviewTime((dragFrame ?? currentFrame) / FPS)
  const formattedDuration = formatPreviewTime(durationInSeconds)
  const sliderValue = dragFrame ?? currentFrame
  const sliderPercent = durationInFrames > 1 ? sliderValue / (durationInFrames - 1) : 0

  return (
    <div className="space-y-3">
      <Player
        ref={playerRef}
        component={TemplateComponent}
        inputProps={{ config: playerConfig }}
        durationInFrames={durationInFrames}
        fps={FPS}
        compositionWidth={dimensions.width}
        compositionHeight={dimensions.height}
        style={{ width: '100%' }}
      />

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5 text-xs text-white/70">
        <button
          type="button"
          className="inline-flex min-h-9 min-w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 px-3 font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={togglePlayback}
          disabled={Boolean(config.audioUrl) && !isAudioReady}
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <span className="w-16 shrink-0 tabular-nums text-white/62">{formattedCurrentTime}</span>
        <div
          ref={trackRef}
          role="slider"
          aria-label="播放进度"
          aria-valuemin={0}
          aria-valuemax={Math.max(durationInFrames - 1, 0)}
          aria-valuenow={sliderValue}
          tabIndex={0}
          className={cn('relative h-6 w-full cursor-pointer select-none')}
          style={{ touchAction: 'none' }}
          onMouseDown={(event) => {
            event.preventDefault()
            handleTrackPress(event.clientX)
          }}
          onTouchStart={(event) => {
            const touch = event.touches[0]

            if (!touch) {
              return
            }

            event.preventDefault()
            handleTrackPress(touch.clientX)
          }}
          onClick={(event) => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false
              return
            }

            if (isDraggingRef.current) {
              return
            }

            handleDirectSeek(getFrameFromClientX(event.clientX))
          }}
          onKeyDown={(event) => {
            const step = event.shiftKey ? FPS * 5 : FPS

            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              handleDirectSeek(sliderValue - step)
              return
            }

            if (event.key === 'ArrowRight') {
              event.preventDefault()
              handleDirectSeek(sliderValue + step)
              return
            }

            if (event.key === 'Home') {
              event.preventDefault()
              handleDirectSeek(0)
              return
            }

            if (event.key === 'End') {
              event.preventDefault()
              handleDirectSeek(durationInFrames - 1)
            }
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/12" />
          <div
            className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
            style={{ width: `${sliderPercent * 100}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/20 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
            style={{ left: `calc(${sliderPercent * 100}% - 8px)` }}
          />
        </div>
        <span className="w-16 shrink-0 text-right tabular-nums text-white/62">{formattedDuration}</span>
      </div>

    </div>
  )
}

function formatPreviewTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60

  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}
