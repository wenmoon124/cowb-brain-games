'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Filter } from 'lucide-react'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  score: string
  round: string
  lives: string
  even: string
  odd: string
  isCenterEven: string
  ignoreDistractors: string
  correct: string
  wrong: string
  hits: string
  errors: string
  avgReaction: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Distraction Filter',
    description:
      'Ignore the distractions. Is the center number even or odd? Stay focused on the target.',
    start: 'Start',
    score: 'Score',
    round: 'Round',
    lives: 'Lives',
    even: 'Even',
    odd: 'Odd',
    isCenterEven: 'Is the center number even or odd?',
    ignoreDistractors: 'Ignore surrounding numbers',
    correct: 'Correct!',
    wrong: 'Wrong!',
    hits: 'Hits',
    errors: 'Errors',
    avgReaction: 'Avg. Reaction',
  },
  zh: {
    title: '干扰过滤',
    description: '忽略干扰。中间的数字是奇数还是偶数？专注于目标。',
    start: '开始',
    score: '得分',
    round: '轮次',
    lives: '生命',
    even: '偶数',
    odd: '奇数',
    isCenterEven: '中间的数字是奇数还是偶数？',
    ignoreDistractors: '忽略周围的数字',
    correct: '正确！',
    wrong: '错误！',
    hits: '命中',
    errors: '错误',
    avgReaction: '平均反应',
  },
  ja: {
    title: 'ディストラクションフィルター',
    description: '邪魔を無視して、中央の数字が偶数か奇数か答えよう。',
    start: '開始',
    score: 'スコア',
    round: 'ラウンド',
    lives: 'ライフ',
    even: '偶数',
    odd: '奇数',
    isCenterEven: '中央の数字は偶数か奇数か？',
    ignoreDistractors: '周囲の数字を無視',
    correct: '正解！',
    wrong: '不正解！',
    hits: '命中',
    errors: 'エラー',
    avgReaction: '平均反応',
  },
}

const TOTAL_ROUNDS = 25
const ROUND_LIMIT_MS = 2500
const MAX_LIVES = 3

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

/** Distractors increase: 2 → 4 → 6 → 8 */
function distractorCountForRound(round: number): number {
  if (round <= 6) return 2
  if (round <= 13) return 4
  if (round <= 19) return 6
  return 8
}

/** distractionCoef = 1.0 + distractorCount × 0.1 */
function distractionCoefficient(distractorCount: number): number {
  return 1.0 + distractorCount * 0.1
}

/** speedCoef = clamp(1.5 - rt/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

interface Distractor {
  value: number
  angle: number // degrees
  radius: number // percent of container
}

interface RoundData {
  centerNumber: number
  isEven: boolean
  distractors: Distractor[]
}

function buildRound(round: number): RoundData {
  const center = Math.floor(Math.random() * 9) + 1 // 1-9
  const count = distractorCountForRound(round)
  const distractors: Distractor[] = []
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + Math.random() * 20
    const radius = 32 + Math.random() * 8
    distractors.push({
      value: Math.floor(Math.random() * 10),
      angle,
      radius,
    })
  }
  return {
    centerNumber: center,
    isEven: center % 2 === 0,
    distractors,
  }
}

export interface DistractionFilterGameProps {
  locale: string
}

export function DistractionFilterGame({ locale }: DistractionFilterGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [round, setRound] = useState(1)
  const [roundData, setRoundData] = useState<RoundData | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [hits, setHits] = useState(0)
  const [errors, setErrors] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(ROUND_LIMIT_MS)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')

  const roundStartRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)
  const livesRef = useRef(MAX_LIVES)
  const respondedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (advanceRef.current !== null) {
      clearTimeout(advanceRef.current)
      advanceRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setRoundData(null)
    setStatus('finished')
  }, [clearTimers])

  const startRoundRef = useRef<((n: number) => void) | null>(null)

  const startRound = useCallback(
    (n: number) => {
      if (finishedRef.current) return
      if (n > TOTAL_ROUNDS || livesRef.current <= 0) {
        finishGame()
        return
      }
      const data = buildRound(n)
      setRoundData(data)
      setRound(n)
      setFeedback('none')
      setTimeLeft(ROUND_LIMIT_MS)
      respondedRef.current = false
      roundStartRef.current = Date.now()

      clearTimers()

      intervalRef.current = setInterval(() => {
        const remaining = ROUND_LIMIT_MS - (Date.now() - roundStartRef.current)
        setTimeLeft(remaining > 0 ? remaining : 0)
      }, 50)

      timeoutRef.current = setTimeout(() => {
        // Timeout = no response → error, -1 life
        if (respondedRef.current) return
        setErrors((e) => e + 1)
        livesRef.current = Math.max(0, livesRef.current - 1)
        setLives(livesRef.current)
        setFeedback('wrong')
        if (livesRef.current <= 0) {
          advanceRef.current = setTimeout(() => finishGame(), 700)
          return
        }
        advanceRef.current = setTimeout(() => {
          startRoundRef.current?.(n + 1)
        }, 600)
      }, ROUND_LIMIT_MS)
    },
    [clearTimers, finishGame]
  )

  useEffect(() => {
    startRoundRef.current = startRound
  }, [startRound])

  const startGame = useCallback(() => {
    finishedRef.current = false
    livesRef.current = MAX_LIVES
    setScore(0)
    setLives(MAX_LIVES)
    setHits(0)
    setErrors(0)
    setReactionTimes([])
    setRound(1)
    setStatus('playing')
    startRound(1)
  }, [startRound])

  const handleAnswer = (answerIsEven: boolean) => {
    if (!roundData || feedback !== 'none' || respondedRef.current) return
    respondedRef.current = true
    const rt = Date.now() - roundStartRef.current
    clearTimers()

    if (answerIsEven === roundData.isEven) {
      setReactionTimes((prev) => [...prev, rt])
      const distractorCount = roundData.distractors.length
      // roundScore = 100 × speedCoef × distractionCoef
      const roundScore = Math.round(
        100 *
          speedCoefficient(rt, ROUND_LIMIT_MS) *
          distractionCoefficient(distractorCount)
      )
      setScore((s) => s + roundScore)
      setHits((h) => h + 1)
      setFeedback('correct')
    } else {
      setErrors((e) => e + 1)
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
      setFeedback('wrong')
    }

    if (livesRef.current <= 0) {
      advanceRef.current = setTimeout(() => finishGame(), 700)
      return
    }

    advanceRef.current = setTimeout(() => {
      startRoundRef.current?.(round + 1)
    }, 500)
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
  // finalScore = max(0, Σ roundScores - errors × 70)
  const finalScore = Math.max(0, score - errors * 70)
  const totalAttempts = hits + errors
  const accuracy =
    totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-attention/15">
            <Filter className="h-8 w-8 text-dim-attention" />
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
        ]}
      />
    )
  }

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.round}</span>
            <span className="text-md font-bold text-text-primary">
              {round}/{TOTAL_ROUNDS}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.score}</span>
            <span className="text-md font-bold text-primary">{score}</span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.lives}</span>
            <span className="text-md font-bold text-error">{lives}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-dim-attention-text">
            {t.isCenterEven}
          </span>
          <span className="text-xs text-text-muted">{t.ignoreDistractors}</span>
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={ROUND_LIMIT_MS}
          dimension="attention"
          showNumber
          roundLabel={`${t.round} ${round}/${TOTAL_ROUNDS}`}
        />

        <div
          className="relative mx-auto flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-background-secondary"
          aria-live="polite"
        >
          {/* Distractors */}
          {roundData?.distractors.map((d, i) => {
            const rad = (d.angle * Math.PI) / 180
            const x = 50 + d.radius * Math.cos(rad)
            const y = 50 + d.radius * Math.sin(rad)
            return (
              <span
                key={`dist-${round}-${i}`}
                className="pointer-events-none absolute select-none text-xl font-bold text-text-muted opacity-60 animate-pulse"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {d.value}
              </span>
            )
          })}

          {/* Center target */}
          {roundData && (
            <span
              key={`center-${round}-${roundData.centerNumber}`}
              className={[
                'select-none text-6xl font-extrabold animate-scale-in',
                feedback === 'correct' ? 'text-success' : '',
                feedback === 'wrong' ? 'text-error' : '',
                feedback === 'none' ? 'text-text-primary' : '',
              ].join(' ')}
            >
              {roundData.centerNumber}
            </span>
          )}

          {feedback !== 'none' && (
            <span
              className={[
                'absolute bottom-4 text-sm font-bold',
                feedback === 'correct' ? 'text-success' : 'text-error',
              ].join(' ')}
            >
              {feedback === 'correct' ? t.correct : t.wrong}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-md">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => handleAnswer(true)}
            disabled={feedback !== 'none'}
          >
            {t.even}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => handleAnswer(false)}
            disabled={feedback !== 'none'}
          >
            {t.odd}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
