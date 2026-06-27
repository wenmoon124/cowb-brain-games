'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wind, Play, Square } from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'inhale' | 'hold' | 'exhale' | 'pause'

type Locale = 'en' | 'zh' | 'ja'

interface BreathingMode {
  key: 'box' | 'resonant' | '478'
  phases: { type: Phase; duration: number }[]
  cycleMs: number
  coefficient: number
}

const BREATHING_MODES: readonly BreathingMode[] = [
  {
    key: 'box',
    phases: [
      { type: 'inhale', duration: 4000 },
      { type: 'hold', duration: 4000 },
      { type: 'exhale', duration: 4000 },
      { type: 'pause', duration: 4000 },
    ],
    cycleMs: 16000,
    coefficient: 1.0,
  },
  {
    key: 'resonant',
    phases: [
      { type: 'inhale', duration: 5000 },
      { type: 'exhale', duration: 5000 },
    ],
    cycleMs: 10000,
    coefficient: 1.1,
  },
  {
    key: '478',
    phases: [
      { type: 'inhale', duration: 4000 },
      { type: 'hold', duration: 7000 },
      { type: 'exhale', duration: 8000 },
    ],
    cycleMs: 19000,
    coefficient: 1.2,
  },
]

interface Texts {
  title: string
  description: string
  start: string
  duration: string
  mode: string
  modeBox: string
  modeResonant: string
  mode478: string
  inhale: string
  hold: string
  exhale: string
  pause: string
  completed: string
  playAgain: string
  endSession: string
  minutes: (n: number) => string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Breathing Flow',
    description:
      'Follow the circle: breathe in, hold, breathe out, pause. Choose a mode and session length.',
    start: 'Start',
    duration: 'Duration',
    mode: 'Mode',
    modeBox: 'Box 4-4-4-4',
    modeResonant: 'Resonant 5-5',
    mode478: '4-7-8',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    pause: 'Pause',
    completed: 'Session Complete',
    playAgain: 'Play Again',
    endSession: 'End Session',
    minutes: (n) => `${n} min`,
  },
  zh: {
    title: '呼吸流',
    description: '跟随圆形：吸气、屏息、呼气、停顿。选择模式和时长。',
    start: '开始',
    duration: '时长',
    mode: '模式',
    modeBox: '箱式 4-4-4-4',
    modeResonant: '共振 5-5',
    mode478: '4-7-8',
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    pause: '停顿',
    completed: '会话完成',
    playAgain: '再来一局',
    endSession: '结束会话',
    minutes: (n) => `${n} 分钟`,
  },
  ja: {
    title: 'ブレスフロー',
    description: '円に従って：吸う、止める、吐く、休止。モードと時間を選択。',
    start: '開始',
    duration: '時間',
    mode: 'モード',
    modeBox: 'ボックス 4-4-4-4',
    modeResonant: 'レゾナント 5-5',
    mode478: '4-7-8',
    inhale: '吸う',
    hold: '止める',
    exhale: '吐く',
    pause: '休止',
    completed: 'セッション完了',
    playAgain: 'もう一度',
    endSession: 'セッション終了',
    minutes: (n) => `${n} 分`,
  },
}

const DURATIONS = [3, 5, 10] as const

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

/** Duration coefficient: 3min=1.0, 5min=1.3, 10min=1.8 */
function durationCoefficient(minutes: number): number {
  if (minutes === 3) return 1.0
  if (minutes === 5) return 1.3
  if (minutes === 10) return 1.8
  return 1.0
}

function getMode(key: string): BreathingMode {
  const mode = BREATHING_MODES.find((m) => m.key === key)
  return mode ?? BREATHING_MODES[0]!
}

function getModeLabel(key: string, t: Texts): string {
  switch (key) {
    case 'box':
      return t.modeBox
    case 'resonant':
      return t.modeResonant
    case '478':
      return t.mode478
    default:
      return t.modeBox
  }
}

function getPhaseText(phase: Phase, t: Texts): string {
  switch (phase) {
    case 'inhale':
      return t.inhale
    case 'hold':
      return t.hold
    case 'exhale':
      return t.exhale
    case 'pause':
      return t.pause
  }
}

/** Compute current phase from elapsed time */
function getPhaseAt(mode: BreathingMode, elapsedMs: number): Phase {
  const cyclePos = elapsedMs % mode.cycleMs
  let cumulative = 0
  for (const phase of mode.phases) {
    cumulative += phase.duration
    if (cyclePos < cumulative) {
      return phase.type
    }
  }
  const firstPhase = mode.phases[0]?.type
  return firstPhase ?? 'inhale'
}

/** Generate CSS keyframes for a breathing mode */
function generateKeyframes(mode: BreathingMode): string {
  const name = `breathe-${mode.key}`
  let cumulative = 0
  const steps: string[] = ['0% { transform: scale(1); }']

  for (const phase of mode.phases) {
    cumulative += phase.duration
    const percent = (cumulative / mode.cycleMs) * 100
    const scale = phase.type === 'inhale' || phase.type === 'hold' ? 1.5 : 1
    steps.push(`${percent.toFixed(4)}% { transform: scale(${scale}); }`)
  }

  return `@keyframes ${name} { ${steps.join(' ')} }`
}

export interface BreathingFlowGameProps {
  locale: string
}

export function BreathingFlowGame({ locale }: BreathingFlowGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [durationMin, setDurationMin] = useState<number>(DURATIONS[1] ?? 5)
  const [modeKey, setModeKey] = useState<string>('box')
  const [elapsedMs, setElapsedMs] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)
  const targetMsRef = useRef<number>(0)
  const finishedRef = useRef(false)
  const completedRef = useRef(false)
  const finalElapsedRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const mode = getMode(modeKey)

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimer()
    setStatus('finished')
  }, [clearTimer])

  const startGame = useCallback(() => {
    finishedRef.current = false
    completedRef.current = false
    finalElapsedRef.current = 0
    setElapsedMs(0)
    targetMsRef.current = durationMin * 60 * 1000
    startRef.current = Date.now()
    setStatus('playing')
    // Use 500ms interval — CSS animation handles smooth scale transitions
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setElapsedMs(elapsed)
      if (elapsed >= targetMsRef.current) {
        completedRef.current = true
        finalElapsedRef.current = elapsed
        finishGame()
      }
    }, 500)
  }, [durationMin, finishGame])

  const endEarly = useCallback(() => {
    completedRef.current = false
    finalElapsedRef.current = Date.now() - startRef.current
    finishGame()
  }, [finishGame])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const targetMs = durationMin * 60 * 1000
  const progressPercent = Math.min(100, (elapsedMs / targetMs) * 100)

  // Scoring per spec:
  // syncRate = elapsed / target (fraction of session user followed along)
  // completeCoef = completed ? 1.0 : 0.5
  // durationCoef = 3min=1.0 / 5min=1.3 / 10min=1.8
  // modeCoef = box=1.0 / resonant=1.1 / 478=1.2
  // score = round(syncRate × 1000 × completeCoef × durationCoef × modeCoef)
  const finalElapsed =
    finalElapsedRef.current > 0 ? finalElapsedRef.current : elapsedMs
  const syncRate = Math.min(1, finalElapsed / targetMs)
  const completeCoef = completedRef.current ? 1.0 : 0.5
  const finalScore = Math.round(
    syncRate * 1000 * completeCoef * durationCoefficient(durationMin) * mode.coefficient
  )

  const elapsedSeconds = Math.floor(finalElapsed / 1000)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-relaxation/15">
            <Wind className="h-8 w-8 text-dim-relaxation" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{t.title}</h2>
          <p className="text-sm text-text-secondary max-w-md">
            {t.description}
          </p>

          <div className="flex flex-col items-center gap-sm w-full max-w-xs">
            <span className="text-xs font-medium text-text-muted">{t.mode}</span>
            <div className="flex flex-wrap justify-center gap-sm">
              {BREATHING_MODES.map((m) => (
                <Button
                  key={m.key}
                  variant={modeKey === m.key ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setModeKey(m.key)}
                >
                  {getModeLabel(m.key, t)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-sm w-full max-w-xs">
            <span className="text-xs font-medium text-text-muted">
              {t.duration}
            </span>
            <div className="flex gap-sm">
              {DURATIONS.map((d) => (
                <Button
                  key={d}
                  variant={durationMin === d ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setDurationMin(d)}
                >
                  {t.minutes(d)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={startGame}
            className="mt-sm"
          >
            <Play className="mr-xs h-5 w-5" />
            {t.start}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'finished') {
    return (
      <GameResult
        score={finalScore}
        dimension="relaxation"
        onRetry={() => setStatus('idle')}
        stats={[
          {
            label: t.duration,
            value: `${Math.floor(elapsedSeconds / 60)}:${String(
              elapsedSeconds % 60
            ).padStart(2, '0')}`,
          },
          { label: t.mode, value: getModeLabel(modeKey, t) },
        ]}
      />
    )
  }

  const phase = getPhaseAt(mode, elapsedMs)
  const phaseText = getPhaseText(phase, t)
  const remainingSeconds = Math.max(
    0,
    Math.ceil((targetMs - elapsedMs) / 1000)
  )

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        {/* Inject CSS keyframes for the current breathing mode */}
        <style>{generateKeyframes(mode)}</style>

        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {Math.floor(elapsedSeconds / 60)}:
            {String(elapsedSeconds % 60).padStart(2, '0')}
          </span>
          <span className="text-xs font-medium text-dim-relaxation-text">
            {getModeLabel(modeKey, t)}
          </span>
          <span className="text-xs text-text-muted">
            {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <Progress value={progressPercent} dimension="default" className="h-1.5" />

        <div className="flex flex-col items-center justify-center gap-md py-3xl min-h-[320px]">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-dim-relaxation/20 blur-md"
              style={{
                animation: `breathe-${mode.key} ${mode.cycleMs}ms ease-in-out infinite`,
              }}
              aria-hidden="true"
            />
            <div
              className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-dim-relaxation to-secondary text-white shadow-glow-relaxation"
              style={{
                animation: `breathe-${mode.key} ${mode.cycleMs}ms ease-in-out infinite`,
              }}
              aria-live="polite"
            >
              <span className="text-lg font-bold text-white">{phaseText}</span>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="md" onClick={endEarly} className="mx-auto">
          <Square className="mr-xs h-4 w-4" />
          {t.endSession}
        </Button>
      </CardContent>
    </Card>
  )
}
