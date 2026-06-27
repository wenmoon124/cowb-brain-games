'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Columns2 } from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'

type Locale = 'en' | 'zh' | 'ja'

type Shape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star'

interface Texts {
  title: string
  description: string
  start: string
  score: string
  stimulus: string
  lives: string
  leftHint: string
  rightHint: string
  leftZone: string
  rightZone: string
  correct: string
  wrong: string
  hits: string
  errors: string
  misses: string
  avgReaction: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Split Focus',
    description:
      'Monitor both sides. Left: tap circles. Right: tap even numbers. Dual-task challenge!',
    start: 'Start',
    score: 'Score',
    stimulus: 'Stimulus',
    lives: 'Lives',
    leftHint: 'Tap if circle',
    rightHint: 'Tap if even',
    leftZone: 'Shapes',
    rightZone: 'Numbers',
    correct: 'Hit!',
    wrong: 'Wrong!',
    hits: 'Hits',
    errors: 'Errors',
    misses: 'Misses',
    avgReaction: 'Avg. Reaction',
  },
  zh: {
    title: '分散专注',
    description: '同时关注两侧。左边：点击圆形。右边：点击偶数。双任务挑战！',
    start: '开始',
    score: '得分',
    stimulus: '刺激',
    lives: '生命',
    leftHint: '圆形则点击',
    rightHint: '偶数则点击',
    leftZone: '形状',
    rightZone: '数字',
    correct: '命中！',
    wrong: '错误！',
    hits: '命中',
    errors: '错误',
    misses: '错过',
    avgReaction: '平均反应',
  },
  ja: {
    title: 'スプリットフォーカス',
    description: '両側を監視しよう。左：円をタップ。右：偶数をタップ。デュアルタスク挑戦！',
    start: '開始',
    score: 'スコア',
    stimulus: '刺激',
    lives: 'ライフ',
    leftHint: '円ならタップ',
    rightHint: '偶数ならタップ',
    leftZone: '図形',
    rightZone: '数字',
    correct: '命中！',
    wrong: '不正解！',
    hits: '命中',
    errors: 'エラー',
    misses: 'ミス',
    avgReaction: '平均反応',
  },
}

const STIMULI_PER_SIDE = 15
const TOTAL_STIMULI = STIMULI_PER_SIDE * 2
const MAX_LIVES = 3
const REACTION_LIMIT_MS = 1500 // for speed coefficient

const SHAPE_SYMBOLS: Record<Shape, string> = {
  circle: '●',
  square: '■',
  triangle: '▲',
  diamond: '◆',
  star: '★',
}

const NON_CIRCLE_SHAPES: readonly Shape[] = [
  'square',
  'triangle',
  'diamond',
  'star',
]
const EVEN_NUMBERS: readonly number[] = [0, 2, 4, 6, 8]
const ODD_NUMBERS: readonly number[] = [1, 3, 5, 7, 9]

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

/** Stimulus interval decreases: 2.0s → 1.5s → 1.2s */
function intervalForIndex(index: number): number {
  if (index < 5) return 2000
  if (index < 10) return 1500
  return 1200
}

/** speedCoef = clamp(1.5 - rt/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

interface LeftStimulus {
  shape: Shape
  isTarget: boolean
}

interface RightStimulus {
  number: number
  isTarget: boolean
}

function buildLeftStimuli(): LeftStimulus[] {
  const stimuli: LeftStimulus[] = []
  for (let i = 0; i < STIMULI_PER_SIDE; i++) {
    const isTarget = Math.random() < 0.4
    if (isTarget) {
      stimuli.push({ shape: 'circle', isTarget: true })
    } else {
      const idx = Math.floor(Math.random() * NON_CIRCLE_SHAPES.length)
      const shape = NON_CIRCLE_SHAPES[idx] ?? 'square'
      stimuli.push({ shape, isTarget: false })
    }
  }
  return stimuli
}

function buildRightStimuli(): RightStimulus[] {
  const stimuli: RightStimulus[] = []
  for (let i = 0; i < STIMULI_PER_SIDE; i++) {
    const isTarget = Math.random() < 0.5
    if (isTarget) {
      const idx = Math.floor(Math.random() * EVEN_NUMBERS.length)
      const number = EVEN_NUMBERS[idx] ?? 0
      stimuli.push({ number, isTarget: true })
    } else {
      const idx = Math.floor(Math.random() * ODD_NUMBERS.length)
      const number = ODD_NUMBERS[idx] ?? 1
      stimuli.push({ number, isTarget: false })
    }
  }
  return stimuli
}

export interface SplitFocusGameProps {
  locale: string
}

export function SplitFocusGame({ locale }: SplitFocusGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [stimulusNumber, setStimulusNumber] = useState(0) // total stimuli shown
  const [leftStimulus, setLeftStimulus] = useState<LeftStimulus | null>(null)
  const [rightStimulus, setRightStimulus] = useState<RightStimulus | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [hits, setHits] = useState(0)
  const [errors, setErrors] = useState(0)
  const [misses, setMisses] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [leftFeedback, setLeftFeedback] = useState<
    'none' | 'correct' | 'wrong'
  >('none')
  const [rightFeedback, setRightFeedback] = useState<
    'none' | 'correct' | 'wrong'
  >('none')

  const leftStimuliRef = useRef<LeftStimulus[]>([])
  const rightStimuliRef = useRef<RightStimulus[]>([])
  const leftIndexRef = useRef(0)
  const rightIndexRef = useRef(0)
  const leftStartRef = useRef(0)
  const rightStartRef = useRef(0)
  const leftRespondedRef = useRef(false)
  const rightRespondedRef = useRef(false)
  const leftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)
  const livesRef = useRef(MAX_LIVES)

  const clearTimers = useCallback(() => {
    if (leftTimerRef.current !== null) {
      clearTimeout(leftTimerRef.current)
      leftTimerRef.current = null
    }
    if (rightTimerRef.current !== null) {
      clearTimeout(rightTimerRef.current)
      rightTimerRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setLeftStimulus(null)
    setRightStimulus(null)
    setStatus('finished')
  }, [clearTimers])

  const advanceLeftRef = useRef<(() => void) | null>(null)
  const advanceRightRef = useRef<(() => void) | null>(null)

  const checkBothDone = useCallback(() => {
    if (
      leftIndexRef.current >= STIMULI_PER_SIDE &&
      rightIndexRef.current >= STIMULI_PER_SIDE
    ) {
      finishGame()
    }
  }, [finishGame])

  const advanceLeft = useCallback(() => {
    if (finishedRef.current) return
    const idx = leftIndexRef.current
    if (idx >= STIMULI_PER_SIDE) {
      setLeftStimulus(null)
      checkBothDone()
      return
    }
    const stimulus = leftStimuliRef.current[idx]
    if (!stimulus) {
      checkBothDone()
      return
    }
    setLeftStimulus(stimulus)
    setLeftFeedback('none')
    leftRespondedRef.current = false
    leftStartRef.current = Date.now()
    setStimulusNumber((n) => n + 1)

    leftTimerRef.current = setTimeout(() => {
      if (finishedRef.current) return
      // If target and not responded → miss
      if (!leftRespondedRef.current && stimulus.isTarget) {
        setMisses((m) => m + 1)
        livesRef.current = Math.max(0, livesRef.current - 1)
        setLives(livesRef.current)
        setLeftFeedback('wrong')
        if (livesRef.current <= 0) {
          finishGame()
          return
        }
      }
      leftIndexRef.current += 1
      advanceLeftRef.current?.()
    }, intervalForIndex(idx))
  }, [checkBothDone, finishGame])

  const advanceRight = useCallback(() => {
    if (finishedRef.current) return
    const idx = rightIndexRef.current
    if (idx >= STIMULI_PER_SIDE) {
      setRightStimulus(null)
      checkBothDone()
      return
    }
    const stimulus = rightStimuliRef.current[idx]
    if (!stimulus) {
      checkBothDone()
      return
    }
    setRightStimulus(stimulus)
    setRightFeedback('none')
    rightRespondedRef.current = false
    rightStartRef.current = Date.now()
    setStimulusNumber((n) => n + 1)

    rightTimerRef.current = setTimeout(() => {
      if (finishedRef.current) return
      if (!rightRespondedRef.current && stimulus.isTarget) {
        setMisses((m) => m + 1)
        livesRef.current = Math.max(0, livesRef.current - 1)
        setLives(livesRef.current)
        setRightFeedback('wrong')
        if (livesRef.current <= 0) {
          finishGame()
          return
        }
      }
      rightIndexRef.current += 1
      advanceRightRef.current?.()
    }, intervalForIndex(idx))
  }, [checkBothDone, finishGame])

  useEffect(() => {
    advanceLeftRef.current = advanceLeft
  }, [advanceLeft])
  useEffect(() => {
    advanceRightRef.current = advanceRight
  }, [advanceRight])

  const startGame = useCallback(() => {
    finishedRef.current = false
    livesRef.current = MAX_LIVES
    leftStimuliRef.current = buildLeftStimuli()
    rightStimuliRef.current = buildRightStimuli()
    leftIndexRef.current = 0
    rightIndexRef.current = 0
    leftRespondedRef.current = false
    rightRespondedRef.current = false
    setScore(0)
    setLives(MAX_LIVES)
    setHits(0)
    setErrors(0)
    setMisses(0)
    setReactionTimes([])
    setStimulusNumber(0)
    setLeftFeedback('none')
    setRightFeedback('none')
    setStatus('playing')
    advanceLeft()
    advanceRight()
  }, [advanceLeft, advanceRight])

  const handleLeftTap = () => {
    if (!leftStimulus || leftFeedback !== 'none') return
    if (leftRespondedRef.current) return
    leftRespondedRef.current = true
    const rt = Date.now() - leftStartRef.current
    if (leftStimulus.isTarget) {
      setReactionTimes((prev) => [...prev, rt])
      // correctScore = 80 × speedCoef
      const gained = Math.round(80 * speedCoefficient(rt, REACTION_LIMIT_MS))
      setScore((s) => s + gained)
      setHits((h) => h + 1)
      setLeftFeedback('correct')
    } else {
      setErrors((e) => e + 1)
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
      setLeftFeedback('wrong')
    }
    if (livesRef.current <= 0) {
      clearTimers()
      setTimeout(() => finishGame(), 600)
    }
  }

  const handleRightTap = () => {
    if (!rightStimulus || rightFeedback !== 'none') return
    if (rightRespondedRef.current) return
    rightRespondedRef.current = true
    const rt = Date.now() - rightStartRef.current
    if (rightStimulus.isTarget) {
      setReactionTimes((prev) => [...prev, rt])
      const gained = Math.round(80 * speedCoefficient(rt, REACTION_LIMIT_MS))
      setScore((s) => s + gained)
      setHits((h) => h + 1)
      setRightFeedback('correct')
    } else {
      setErrors((e) => e + 1)
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
      setRightFeedback('wrong')
    }
    if (livesRef.current <= 0) {
      clearTimers()
      setTimeout(() => finishGame(), 600)
    }
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((sum, rt) => sum + rt, 0) /
            reactionTimes.length
        )
      : 0
  // finalScore = max(0, Σ correctScores - errors × 90 - misses × 70)
  const finalScore = Math.max(0, score - errors * 90 - misses * 70)
  const totalAttempts = hits + errors + misses
  const accuracy =
    totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-attention/15">
            <Columns2 className="h-8 w-8 text-dim-attention" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{t.title}</h2>
          <p className="text-sm text-text-secondary max-w-md">
            {t.description}
          </p>
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
        accuracy={accuracy}
        dimension="attention"
        onRetry={startGame}
        stats={[
          { label: t.avgReaction, value: `${avgReaction}ms` },
          { label: t.hits, value: hits },
          { label: t.errors, value: errors },
          { label: t.misses, value: misses },
        ]}
      />
    )
  }

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.stimulus}</span>
            <span className="text-md font-bold text-text-primary">
              {Math.min(stimulusNumber, TOTAL_STIMULI)}/{TOTAL_STIMULI}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.score}</span>
            <span className="text-md font-bold text-primary">{finalScore}</span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.lives}</span>
            <span className="text-md font-bold text-error">{lives}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-dim-attention-text">
            {t.leftHint}
          </span>
          <span className="text-sm font-semibold text-dim-attention-text">
            {t.rightHint}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-md">
          {/* Left zone — shapes */}
          <button
            type="button"
            onClick={handleLeftTap}
            disabled={!leftStimulus || leftFeedback !== 'none'}
            aria-label={t.leftZone}
            className={[
              'relative flex h-48 flex-col items-center justify-center gap-sm rounded-lg border-2 transition-all',
              leftFeedback === 'correct'
                ? 'border-success bg-success/10'
                : leftFeedback === 'wrong'
                  ? 'border-error bg-error/10 animate-shake'
                  : 'border-border bg-background-secondary hover:border-dim-attention hover:bg-primary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            ].join(' ')}
          >
            <span className="absolute left-xs top-xs text-xs font-medium uppercase tracking-wider text-text-muted">
              {t.leftZone}
            </span>
            {leftStimulus ? (
              <span
                key={`left-${leftIndexRef.current}-${leftStimulus.shape}`}
                className={[
                  'select-none text-6xl font-bold animate-scale-in',
                  leftFeedback === 'correct' ? 'text-success' : '',
                  leftFeedback === 'wrong' ? 'text-error' : '',
                  leftFeedback === 'none' ? 'text-text-primary' : '',
                ].join(' ')}
                aria-hidden="true"
              >
                {SHAPE_SYMBOLS[leftStimulus.shape]}
              </span>
            ) : (
              <span className="text-sm text-text-muted">—</span>
            )}
            {leftFeedback !== 'none' && (
              <span
                className={[
                  'text-xs font-bold',
                  leftFeedback === 'correct' ? 'text-success' : 'text-error',
                ].join(' ')}
              >
                {leftFeedback === 'correct' ? t.correct : t.wrong}
              </span>
            )}
          </button>

          {/* Right zone — numbers */}
          <button
            type="button"
            onClick={handleRightTap}
            disabled={!rightStimulus || rightFeedback !== 'none'}
            aria-label={t.rightZone}
            className={[
              'relative flex h-48 flex-col items-center justify-center gap-sm rounded-lg border-2 transition-all',
              rightFeedback === 'correct'
                ? 'border-success bg-success/10'
                : rightFeedback === 'wrong'
                  ? 'border-error bg-error/10 animate-shake'
                  : 'border-border bg-background-secondary hover:border-dim-attention hover:bg-primary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            ].join(' ')}
          >
            <span className="absolute left-xs top-xs text-xs font-medium uppercase tracking-wider text-text-muted">
              {t.rightZone}
            </span>
            {rightStimulus ? (
              <span
                key={`right-${rightIndexRef.current}-${rightStimulus.number}`}
                className={[
                  'select-none text-6xl font-bold animate-scale-in',
                  rightFeedback === 'correct' ? 'text-success' : '',
                  rightFeedback === 'wrong' ? 'text-error' : '',
                  rightFeedback === 'none' ? 'text-text-primary' : '',
                ].join(' ')}
                aria-hidden="true"
              >
                {rightStimulus.number}
              </span>
            ) : (
              <span className="text-sm text-text-muted">—</span>
            )}
            {rightFeedback !== 'none' && (
              <span
                className={[
                  'text-xs font-bold',
                  rightFeedback === 'correct' ? 'text-success' : 'text-error',
                ].join(' ')}
              >
                {rightFeedback === 'correct' ? t.correct : t.wrong}
              </span>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
