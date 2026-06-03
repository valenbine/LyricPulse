import { motion } from 'framer-motion'
import {
  Activity,
  AudioLines,
  BadgeCheck,
  Clapperboard,
  Download,
  Film,
  Image,
  Loader2,
  Music2,
  Play,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Wand2
} from 'lucide-react'
import { useId, useState, type ChangeEvent, type ReactNode } from 'react'
import {
  audioFormats,
  coverFormats,
  lyricFormats,
  templateIds,
  videoRatios,
  type AssetKind,
  type Project,
  type RenderJob,
  type TemplateId,
  type VideoRatio
} from '@lyricpulse/core'
import {
  analyzeProject,
  createProject,
  createRenderJob,
  getRenderJob,
  uploadAsset
} from './api'
import { Button } from './components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { cn } from './lib/utils'

type UploadState = Record<AssetKind, File | undefined>

type RenderHistoryItem = {
  id: string
  templateId: TemplateId
  ratio: VideoRatio
  createdAt: string
}

const acceptedFormats: Record<AssetKind, readonly string[]> = {
  audio: audioFormats,
  lyrics: lyricFormats,
  cover: coverFormats
}

const templateCopy: Record<TemplateId, { label: string; description: string }> =
  {
    PulseCover: {
      label: 'Pulse Cover',
      description: '封面随节拍呼吸，主歌大字突出，适合强副歌。'
    },
    NeonLyric: {
      label: 'Neon Lyric',
      description: '霓虹发光文字和流动渐变，适合电子、流行和夜店氛围。'
    },
    WaveformStage: {
      label: 'Waveform Stage',
      description: '波形舞台、封面虚化背景和歌词推进，适合叙事型歌曲。'
    }
  }

const themePresets = [
  { name: 'Volt', primary: '#8B5CF6', accent: '#22C55E' },
  { name: 'Laser', primary: '#06B6D4', accent: '#F97316' },
  { name: 'Aura', primary: '#EC4899', accent: '#A3E635' }
]

export function App() {
  const [title, setTitle] = useState('午夜信号')
  const [artist, setArtist] = useState('LyricPulse 示例')
  const [uploads, setUploads] = useState<UploadState>({
    audio: undefined,
    lyrics: undefined,
    cover: undefined
  })
  const [project, setProject] = useState<Project | undefined>()
  const [templateId, setTemplateId] = useState<TemplateId>('NeonLyric')
  const [ratio, setRatio] = useState<VideoRatio>('9:16')
  const [themeIndex, setThemeIndex] = useState(0)
  const [status, setStatus] = useState('准备生成音乐响应式歌词视频。')
  const [renderJob, setRenderJob] = useState<RenderJob | undefined>()
  const [renderHistory, setRenderHistory] = useState<RenderHistoryItem[]>([])
  const [isRendering, setIsRendering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const canUpload = Boolean(uploads.audio && uploads.lyrics && uploads.cover)
  const selectedTheme = themePresets[themeIndex]
  const lyrics = project?.lyrics ?? sampleLyrics
  const renderReadiness = getRenderReadiness(project)

  async function handleCreateStudioProject() {
    if (!canUpload || isUploading) {
      return
    }

    setIsUploading(true)
    setError(undefined)
    setStatus('正在创建项目并上传素材...')

    try {
      const created = await createProject({ title, artist })
      let nextProject = created.project

      for (const kind of ['audio', 'lyrics', 'cover'] as const) {
        const file = uploads[kind]

        if (!file) {
          continue
        }

        const result = await uploadAsset(nextProject.id, kind, file)
        nextProject = result.project
        setProject(nextProject)
      }

      setStatus('正在分析音频节奏和响度...')
      const analyzed = await analyzeProject(nextProject.id)
      setProject(analyzed.project)
      setStatus('Studio 已同步，可以调模板并开始渲染。')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '上传失败')
      setStatus('项目创建需要处理错误。')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleStartRender() {
    if (!project || isRendering) {
      return
    }

    const readiness = getRenderReadiness(project)

    if (readiness.issues.length > 0) {
      const message = `渲染前还需要处理：${readiness.issues.join('、')}`
      setError(message)
      setStatus('渲染准备未完成。')
      return
    }

    setIsRendering(true)
    setError(undefined)
    setStatus('正在创建渲染任务...')

    try {
      const created = await createRenderJob(project.id, {
        ratio,
        templateId,
        title: project.title ?? title,
        artist: project.artist ?? artist,
        theme: {
          primaryColor: selectedTheme.primary,
          accentColor: selectedTheme.accent,
          backgroundIntensity: 0.85,
          fontFamily: 'Poppins, sans-serif'
        },
        effect: {
          lyricGlow: 0.8,
          pulseIntensity: 0.75,
          beatImpact: 0.7
        }
      })

      setRenderJob(created.job)
      setStatus('渲染任务已创建，正在生成 MP4...')

      const finished = await pollRenderJob(
        project.id,
        created.job.id,
        (job) => {
          setRenderJob(job)
        }
      )
      setRenderJob(finished)
      if (finished.status === 'succeeded') {
        setRenderHistory((current) => [
          {
            id: finished.id,
            templateId: finished.config.templateId,
            ratio: finished.config.ratio,
            createdAt: finished.updatedAt
          },
          ...current.filter((item) => item.id !== finished.id)
        ])
      }
      setStatus(
        finished.status === 'succeeded'
          ? 'MP4 已生成，可以预览和下载。'
          : `渲染失败：${finished.failureReason ?? '未知错误'}`
      )
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '渲染失败')
      setStatus('渲染任务创建失败。')
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
        <Header />

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <HeroPanel
            title={title}
            artist={artist}
            setTitle={setTitle}
            setArtist={setArtist}
            uploads={uploads}
            setUploads={setUploads}
            canUpload={canUpload}
            isUploading={isUploading}
            status={status}
            error={error}
            onCreate={handleCreateStudioProject}
          />
          <PreviewPanel
            ratio={ratio}
            templateId={templateId}
            theme={selectedTheme}
            lyrics={lyrics}
            title={project?.title ?? title}
            artist={project?.artist ?? artist}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr_0.8fr]">
          <EditorPanel
            templateId={templateId}
            setTemplateId={setTemplateId}
            ratio={ratio}
            setRatio={setRatio}
            themeIndex={themeIndex}
            setThemeIndex={setThemeIndex}
          />
          <TimelinePanel lyrics={lyrics} />
          <AnalysisPanel project={project} status={status} />
        </section>

        <RenderPanel
          project={project}
          renderJob={renderJob}
          renderReadiness={renderReadiness}
          renderHistory={renderHistory}
          isRendering={isRendering}
          onRender={handleStartRender}
        />
      </div>
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-4 z-20 rounded-full border border-white/10 bg-background/70 px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_0_28px_rgba(34,197,94,0.45)]">
            <AudioLines className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-2xl leading-none tracking-wide">
              LyricPulse
            </p>
            <p className="text-xs text-muted-foreground">动态歌词视频工作台</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {['上传', '调参', '预览', '渲染'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 px-3 py-2"
            >
              {item}
            </span>
          ))}
        </nav>
      </div>
    </header>
  )
}

type HeroPanelProps = {
  title: string
  artist: string
  setTitle: (value: string) => void
  setArtist: (value: string) => void
  uploads: UploadState
  setUploads: (value: UploadState) => void
  canUpload: boolean
  isUploading: boolean
  status: string
  error?: string
  onCreate: () => void
}

function HeroPanel({
  title,
  artist,
  setTitle,
  setArtist,
  uploads,
  setUploads,
  canUpload,
  isUploading,
  status,
  error,
  onCreate
}: HeroPanelProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
      <CardHeader className="relative">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
          <Sparkles className="size-4" aria-hidden="true" />
          本地优先的开源 Studio
        </div>
        <h1 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-wide text-foreground sm:text-6xl">
          把歌词变成会跟着音乐跳动的视频。
        </h1>
        <CardDescription className="max-w-xl text-base leading-7">
          上传音频、LRC 歌词和封面图。LyricPulse
          会自动解析歌词、分析节奏，并生成可渲染的动态视觉项目。
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="歌曲标题">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field label="艺人 / 作者">
            <Input
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <UploadTile
            kind="audio"
            icon={Music2}
            label="音频"
            file={uploads.audio}
            onChange={(file) => setUploads({ ...uploads, audio: file })}
          />
          <UploadTile
            kind="lyrics"
            icon={Clapperboard}
            label="LRC 歌词"
            file={uploads.lyrics}
            onChange={(file) => setUploads({ ...uploads, lyrics: file })}
          />
          <UploadTile
            kind="cover"
            icon={Image}
            label="封面图"
            file={uploads.cover}
            onChange={(file) => setUploads({ ...uploads, cover: file })}
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/6 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{status}</p>
            <p className="text-xs text-muted-foreground">
              支持：MP3/WAV/FLAC/M4A、LRC、JPG/PNG/WebP。
            </p>
          </div>
          <Button disabled={!canUpload || isUploading} onClick={onCreate}>
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            同步到 Studio
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

type UploadTileProps = {
  kind: AssetKind
  icon: typeof Music2
  label: string
  file?: File
  onChange: (file: File | undefined) => void
}

function UploadTile({
  kind,
  icon: Icon,
  label,
  file,
  onChange
}: UploadTileProps) {
  const inputId = useId()
  const formats = acceptedFormats[kind]

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0])
  }

  return (
    <label
      htmlFor={inputId}
      className="group flex min-h-40 cursor-pointer flex-col justify-between rounded-3xl border border-dashed border-white/15 bg-white/6 p-4 transition duration-200 hover:border-accent/60 hover:bg-accent/10"
    >
      <input
        id={inputId}
        className="sr-only"
        type="file"
        onChange={handleChange}
      />
      <div className="flex items-center justify-between">
        <div className="grid size-11 place-items-center rounded-2xl bg-white/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        {file ? (
          <BadgeCheck className="size-5 text-accent" aria-hidden="true" />
        ) : null}
      </div>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {file?.name ?? formats.join(', ').toUpperCase()}
        </p>
      </div>
    </label>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const fieldId = useId()

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div id={fieldId}>{children}</div>
    </div>
  )
}

type PreviewPanelProps = {
  ratio: VideoRatio
  templateId: TemplateId
  theme: (typeof themePresets)[number]
  lyrics: typeof sampleLyrics
  title: string
  artist: string
}

function PreviewPanel({
  ratio,
  templateId,
  theme,
  lyrics,
  title,
  artist
}: PreviewPanelProps) {
  const isPortrait = ratio === '9:16'

  return (
    <Card className="overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between gap-3 px-2">
        <div>
          <p className="text-sm text-muted-foreground">实时视觉方向</p>
          <h2 className="text-2xl font-semibold">
            {templateCopy[templateId].label}
          </h2>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-2 text-sm text-muted-foreground">
          {ratio}
        </div>
      </div>
      <div className="grid place-items-center rounded-[1.5rem] bg-black/30 p-5">
        <motion.div
          className={cn(
            'relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#101025] shadow-[0_32px_120px_rgba(0,0,0,0.6)]',
            isPortrait
              ? 'aspect-[9/16] w-full max-w-[340px]'
              : 'aspect-video w-full'
          )}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${theme.primary}99, transparent 32%), radial-gradient(circle at 72% 70%, ${theme.accent}88, transparent 34%), linear-gradient(145deg, #080816, #171733)`
            }}
          />
          <motion.div
            className="absolute left-1/2 top-20 size-44 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 shadow-[0_0_80px_rgba(255,255,255,0.24)] backdrop-blur-md"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-x-8 top-8 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/70">
            <span>LyricPulse</span>
            <span>{templateId}</span>
          </div>
          <div className="absolute inset-x-7 bottom-10 space-y-5">
            <div>
              <p className="text-sm text-white/60">{artist}</p>
              <p className="font-display text-4xl leading-none tracking-wide text-white">
                {title}
              </p>
            </div>
            <div className="space-y-3">
              {lyrics.slice(0, 3).map((line, index) => (
                <motion.p
                  key={line.id}
                  className={cn(
                    'rounded-2xl border border-white/10 px-4 py-3 font-semibold',
                    index === 1
                      ? 'bg-white text-[#080816] shadow-[0_0_40px_rgba(255,255,255,0.28)]'
                      : 'bg-white/10 text-white/70'
                  )}
                  animate={index === 1 ? { x: [0, 4, 0] } : undefined}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
          </div>
          <WaveStrips color={theme.accent} />
        </motion.div>
      </div>
    </Card>
  )
}

function WaveStrips({ color }: { color: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-20 items-end gap-1 px-5 opacity-70">
      {Array.from({ length: 28 }).map((_, index) => (
        <motion.span
          key={index}
          className="flex-1 rounded-t-full"
          style={{ backgroundColor: color }}
          animate={{
            height: [
              `${18 + (index % 5) * 8}%`,
              `${56 - (index % 4) * 7}%`,
              `${18 + (index % 5) * 8}%`
            ]
          }}
          transition={{
            duration: 1 + (index % 6) * 0.08,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

type EditorPanelProps = {
  templateId: TemplateId
  setTemplateId: (templateId: TemplateId) => void
  ratio: VideoRatio
  setRatio: (ratio: VideoRatio) => void
  themeIndex: number
  setThemeIndex: (index: number) => void
}

function EditorPanel({
  templateId,
  setTemplateId,
  ratio,
  setRatio,
  themeIndex,
  setThemeIndex
}: EditorPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal
            className="size-5 text-accent"
            aria-hidden="true"
          />
          Studio 控制台
        </CardTitle>
        <CardDescription>选择模板、画幅和颜色能量。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ControlGroup label="模板">
          {templateIds.map((id) => (
            <ChoiceButton
              key={id}
              active={templateId === id}
              title={templateCopy[id].label}
              description={templateCopy[id].description}
              onClick={() => setTemplateId(id)}
            />
          ))}
        </ControlGroup>
        <ControlGroup label="画幅">
          <div className="grid grid-cols-2 gap-2">
            {videoRatios.map((nextRatio) => (
              <Button
                key={nextRatio}
                variant={ratio === nextRatio ? 'default' : 'secondary'}
                onClick={() => setRatio(nextRatio)}
              >
                {nextRatio}
              </Button>
            ))}
          </div>
        </ControlGroup>
        <ControlGroup label="主题">
          <div className="grid gap-2">
            {themePresets.map((theme, index) => (
              <button
                key={theme.name}
                className={cn(
                  'flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border px-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  themeIndex === index
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 bg-white/6 hover:bg-white/10'
                )}
                onClick={() => setThemeIndex(index)}
              >
                <span className="font-medium">{theme.name}</span>
                <span className="flex gap-1">
                  <span
                    className="size-5 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span
                    className="size-5 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </span>
              </button>
            ))}
          </div>
        </ControlGroup>
      </CardContent>
    </Card>
  )
}

function ControlGroup({
  label,
  children
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function ChoiceButton({
  active,
  title,
  description,
  onClick
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'w-full cursor-pointer rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-accent bg-accent/10'
          : 'border-white/10 bg-white/6 hover:bg-white/10'
      )}
      onClick={onClick}
    >
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

function TimelinePanel({ lyrics }: { lyrics: typeof sampleLyrics }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5 text-accent" aria-hidden="true" />
          歌词时间线
        </CardTitle>
        <CardDescription>
          上传 LRC 后，这里会显示解析后的逐行时间轴。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lyrics.slice(0, 7).map((line, index) => (
          <div
            key={line.id}
            className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-white/10 bg-white/6 p-3"
          >
            <span className="font-mono text-xs text-accent">
              {formatTime(line.startTime)}
            </span>
            <span
              className={cn(
                'text-sm',
                index === 1 ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {line.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AnalysisPanel({
  project,
  status
}: {
  project?: Project
  status: string
}) {
  const analysis = project?.analysis
  const metrics = [
    {
      label: '时长',
      value: analysis ? `${analysis.duration.toFixed(1)}s` : '待分析'
    },
    {
      label: 'BPM',
      value: analysis?.bpm ? Math.round(analysis.bpm).toString() : '回退值'
    },
    {
      label: '节拍',
      value: analysis ? analysis.beats.length.toString() : '待分析'
    },
    {
      label: '分析帧',
      value: analysis ? analysis.frames.length.toString() : '待分析'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="size-5 text-accent" aria-hidden="true" />
          音频分析
        </CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/6 p-4"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
        {analysis?.unavailableFields?.length ? (
          <p className="rounded-2xl border border-white/10 bg-white/6 p-3 text-xs leading-5 text-muted-foreground">
            使用回退数据的字段：{analysis.unavailableFields.join(', ')}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function RenderPanel({
  project,
  renderJob,
  renderReadiness,
  renderHistory,
  isRendering,
  onRender
}: {
  project?: Project
  renderJob?: RenderJob
  renderReadiness: RenderReadiness
  renderHistory: RenderHistoryItem[]
  isRendering: boolean
  onRender: () => void
}) {
  const downloadUrl =
    project && renderJob?.status === 'succeeded'
      ? `/api/projects/${project.id}/render/${renderJob.id}/download`
      : undefined
  const canRender = Boolean(project && renderReadiness.issues.length === 0)
  const isRetry = renderJob?.status === 'failed'

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-5">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/20 text-primary">
              <Film className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">渲染结果</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                创建本地渲染任务后，系统会调用 Remotion 生成
                MP4。任务完成后可直接预览和下载。
              </p>
              {renderJob ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    状态：{translateRenderStatus(renderJob.status)}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    进度：{Math.round(renderJob.progress * 100)}%
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    模板：{templateCopy[renderJob.config.templateId].label}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    画幅：{renderJob.config.ratio}
                  </span>
                </div>
              ) : null}
              {renderJob?.failureReason ? (
                <p className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {renderJob.failureReason}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={!canRender || isRendering} onClick={onRender}>
              {isRendering ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Film className="size-4" aria-hidden="true" />
              )}
              {isRetry ? '重新渲染' : '开始渲染'}
            </Button>
            <Button
              asLink
              variant="secondary"
              disabled={!downloadUrl}
              href={downloadUrl}
            >
              <Play className="size-4" aria-hidden="true" />
              预览 MP4
            </Button>
            <Button asLink disabled={!downloadUrl} href={downloadUrl} download>
              <Download className="size-4" aria-hidden="true" />
              下载
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              渲染前检查
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {renderReadiness.checks.map((check) => (
                <div
                  key={check.label}
                  className={cn(
                    'rounded-2xl border px-3 py-2 text-xs',
                    check.done
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-white/10 bg-black/20 text-muted-foreground'
                  )}
                >
                  {check.done ? '已完成' : '待完成'}：{check.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              最近导出
            </p>
            {renderHistory.length > 0 && project ? (
              <div className="space-y-2">
                {renderHistory.slice(0, 4).map((item) => (
                  <a
                    key={item.id}
                    className="flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border border-white/10 px-3 text-xs text-muted-foreground transition hover:border-accent/40 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={`/api/projects/${project.id}/render/${item.id}/download`}
                    download
                  >
                    <span>
                      {templateCopy[item.templateId].label} · {item.ratio}
                    </span>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs leading-5 text-muted-foreground">
                成功渲染后会在这里保留下载入口，方便连续导出不同模板和画幅。
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function pollRenderJob(
  projectId: string,
  jobId: string,
  onUpdate: (job: RenderJob) => void
): Promise<RenderJob> {
  for (let attempt = 0; attempt < 180; attempt += 1) {
    const { job } = await getRenderJob(projectId, jobId)
    onUpdate(job)

    if (job.status === 'succeeded' || job.status === 'failed') {
      return job
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('渲染任务超时')
}

type RenderReadiness = {
  checks: Array<{ label: string; done: boolean }>
  issues: string[]
}

function getRenderReadiness(project?: Project): RenderReadiness {
  const checks = [
    { label: '项目已创建', done: Boolean(project) },
    {
      label: '音频已上传',
      done: Boolean(project?.assets.some((asset) => asset.kind === 'audio'))
    },
    {
      label: '歌词已解析',
      done: Boolean(project?.lyrics.length)
    },
    {
      label: '封面已上传',
      done: Boolean(project?.assets.some((asset) => asset.kind === 'cover'))
    },
    { label: '音频分析已完成', done: Boolean(project?.analysis) }
  ]

  return {
    checks,
    issues: checks.filter((check) => !check.done).map((check) => check.label)
  }
}

function translateRenderStatus(status: RenderJob['status']) {
  const labels: Record<RenderJob['status'], string> = {
    created: '已创建',
    analyzing: '分析中',
    rendering: '渲染中',
    succeeded: '已完成',
    failed: '失败'
  }

  return labels[status]
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const sampleLyrics = [
  {
    id: 'sample-1',
    startTime: 0,
    text: '午夜里信号慢慢升起'
  },
  {
    id: 'sample-2',
    startTime: 8,
    text: '每一次鼓点都比上一秒更亮'
  },
  {
    id: 'sample-3',
    startTime: 16,
    text: '歌词被点燃，穿过整个画面'
  },
  {
    id: 'sample-4',
    startTime: 24,
    text: '我们把副歌涂成电子绿色'
  },
  {
    id: 'sample-5',
    startTime: 32,
    text: '让脉冲决定颜色落点'
  },
  {
    id: 'sample-6',
    startTime: 40,
    text: '每一行文字都锁在声音上'
  },
  { id: 'sample-7', startTime: 48, text: '把夜晚渲染成一支歌词影片' }
]
