'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wind, Play, RotateCcw, Square } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'inhale' | 'hold' | 'exhale' | 'pause'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  duration: string
  inhale: string
  hold: string
  exhale: string
  pause: string
  completed: string
  playAgain: string
  endSession: string
  finalScore: string
  minutes: (n: number) => string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Breathing Flow',
    description:
      'Follow the circle: breathe in, hold, breathe out, pause. Choose a session length.',
    start: 'Start',
    duration: 'Duration',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    pause: 'Pause',
    completed: 'Session Complete',
    playAgain: 'Play Again',
    endSession: 'End Session',
    finalScore: 'Final Score',
    minutes: (n) => `${n} min`,
  },
  zh: {
    title: '呼吸流',
    description: '跟随圆形：吸气、屏息、呼气、停顿。选择会话时长。',
    start: '开始',
    duration: '时长',
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    pause: '停顿',
    completed: '会话完成',
    playAgain: '再来一局',
    endSession: '结束会话',
    finalScore: '最终得分',
    minutes: (n) => `${n} 分钟`,
  },
  ja: {
    title: 'ブレスフロー',
    description: '円に従って：吸う、止める、吐く、休止。セッション時間を選択。',
    start: '開始',
    duration: '時間',
    inhale: '吸う',
    hold: '止める',
    exhale: '吐く',
    pause: '休止',
    completed: 'セッション完了',
    playAgain: 'もう一度',
    endSession: 'セッション終了',
    finalScore: '最終スコア',
    minutes: (n) => `${n} 分`,
  },
}

const DURATIONS = [3, 5, 10] as const
const PHASE_INHALE_MS = 4000
const PHASE_HOLD_MS = 4000
const PHASE_EXHALE_MS = 4000
const PHASE_PAUSE_MS = 2000
const CYCLE_MS =
  PHASE_INHALE_MS + PHASE_HOLD_MS + PHASE_EXHALE_MS + PHASE_PAUSE_MS

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function getPhase(cyclePos: number): { phase: Phase; scale: number } {
  if (cyclePos < PHASE_INHALE_MS) {
    const p = cyclePos / PHASE_INHALE_MS
    return { phase: 'inhale', scale: 1 + p * 0.5 }
  }
  if (cyclePos < PHASE_INHALE_MS + PHASE_HOLD_MS) {
    return { phase: 'hold', scale: 1.5 }
  }
  if (cyclePos < PHASE_INHALE_MS + PHASE_HOLD_MS + PHASE_EXHALE_MS) {
    const p =
      (cyclePos - PHASE_INHALE_MS - PHASE_HOLD_MS) / PHASE_EXHALE_MS
    return { phase: 'exhale', scale: 1.5 - p * 0.5 }
  }
  return { phase: 'pause', scale: 1 }
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

export interface BreathingFlowGameProps {
  locale: string
}

export function BreathingFlowGame({ locale }: BreathingFlowGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [durationMin, setDurationMin] = useState<number>(DURATIONS[1] ?? 5)
  const [elapsedMs, setElapsedMs] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)
  const targetMsRef = useRef<number>(0)
  const finishedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimer()
    setStatus('finished')
  }, [clearTimer])

  const startGame = useCallback(() => {
    finishedRef.current = false
    setElapsedMs(0)
    targetMsRef.current = durationMin * 60 * 1000
    startRef.current = Date.now()
    setStatus('playing')
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setElapsedMs(elapsed)
      if (elapsed >= targetMsRef.current) {
        finishGame()
      }
    }, 100)
  }, [durationMin, finishGame])

  const endEarly = useCallback(() => {
    finishGame()
  }, [finishGame])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const targetMs = durationMin * 60 * 1000
  const cyclePos = elapsedMs % CYCLE_MS
  const { phase, scale } = getPhase(cyclePos)
  const progressPercent = Math.min(100, (elapsedMs / targetMs) * 100)
  const completionRate = Math.min(1, elapsedMs / targetMs)
  const finalScore = Math.round(completionRate * 1000)
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const remainingSeconds = Math.max(
    0,
    Math.ceil((targetMs - elapsedMs) / 1000)
  )

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
            <span className="text-xs text-text-muted">{t.duration}</span>
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
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-relaxation/15">
            <Wind className="h-8 w-8 text-dim-relaxation" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            {t.completed}
          </h2>
          <div className="grid grid-cols-2 gap-md w-full max-w-md">
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.finalScore}</div>
              <div className="text-xl font-bold text-primary">
                {finalScore}
              </div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.duration}</div>
              <div className="text-xl font-bold text-text-primary">
                {Math.floor(elapsedSeconds / 60)}:
                {String(elapsedSeconds % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
          <Button variant="primary" size="lg" onClick={() => setStatus('idle')}>
            <RotateCcw className="mr-xs h-5 w-5" />
            {t.playAgain}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const phaseText = getPhaseText(phase, t)

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {Math.floor(elapsedSeconds / 60)}:
            {String(elapsedSeconds % 60).padStart(2, '0')}
          </span>
          <span className="text-xs text-text-muted">
            {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <Progress
          value={progressPercent}
          dimension="default"
          className="h-1.5"
        />

        <div className="flex flex-col items-center justify-center gap-md py-3xl min-h-[320px]">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-dim-relaxation/20 blur-md"
              style={{ transform: `scale(${scale})` }}
              aria-hidden="true"
            />
            <div
              className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-dim-relaxation to-secondary text-white shadow-glow-relaxation transition-transform"
              style={{ transform: `scale(${scale})`, transitionDuration: '100ms' }}
              aria-live="polite"
            >
              <span className="text-lg font-bold">{phaseText}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={endEarly}
          className="mx-auto"
        >
          <Square className="mr-xs h-4 w-4" />
          {t.endSession}
        </Button>
      </CardContent>
    </Card>
  )
}
