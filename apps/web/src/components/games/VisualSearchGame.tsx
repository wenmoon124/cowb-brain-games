'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Target } from 'lucide-react'
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
  misses: string
  findTarget: string
  gameover: string
  playAgain: string
  accuracy: string
  avgReaction: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Visual Search',
    description: 'Find the ★ target among distractors. 20 rounds, 3s each.',
    start: 'Start',
    score: 'Score',
    round: 'Round',
    misses: 'Misses',
    findTarget: 'Tap the ★',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    accuracy: 'Accuracy',
    avgReaction: 'Avg. Reaction',
  },
  zh: {
    title: '视觉搜索',
    description: '在干扰符号中找到 ★ 目标。共 20 轮，每轮 3 秒。',
    start: '开始',
    score: '得分',
    round: '轮次',
    misses: '错过',
    findTarget: '点击 ★',
    gameover: '游戏结束',
    playAgain: '再来一局',
    accuracy: '准确率',
    avgReaction: '平均反应',
  },
  ja: {
    title: 'ビジュアルサーチ',
    description: '妨害の中から ★ 目標を見つけよう。全20ラウンド、各3秒。',
    start: '開始',
    score: 'スコア',
    round: 'ラウンド',
    misses: 'ミス',
    findTarget: '★ をタップ',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    accuracy: '正確率',
    avgReaction: '平均反応',
  },
}

const TOTAL_ROUNDS = 20
const ROUND_LIMIT_MS = 3000
const TARGET_SYMBOL = '★'
const DISTRACTORS = ['●', '▲', '■', '◆', '✦', '◯', '△', '▢', '♦'] as const

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function gridSizeForRound(round: number): number {
  if (round <= 6) return 4
  if (round <= 13) return 5
  return 6
}

function pick<T>(arr: readonly T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)]
  if (item === undefined) {
    return arr[0] as T
  }
  return item
}

/** Difficulty coefficient: 1.0 + floor((round-1)/5) * 0.5, capped at 3.0 */
function difficultyCoefficient(round: number): number {
  return Math.min(3.0, 1.0 + Math.floor((round - 1) / 5) * 0.5)
}

/** Speed coefficient: clamp(1.5 - reactionTime/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

interface RoundData {
  cells: string[]
  targetIndex: number
}

function buildRound(round: number): RoundData {
  const size = gridSizeForRound(round)
  const total = size * size
  const targetIndex = Math.floor(Math.random() * total)
  const cells: string[] = []
  for (let i = 0; i < total; i++) {
    if (i === targetIndex) {
      cells.push(TARGET_SYMBOL)
    } else {
      cells.push(pick(DISTRACTORS))
    }
  }
  return { cells, targetIndex }
}

export interface VisualSearchGameProps {
  locale: string
}

export function VisualSearchGame({ locale }: VisualSearchGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [hits, setHits] = useState(0)
  const [roundData, setRoundData] = useState<RoundData | null>(null)
  const [timeLeft, setTimeLeft] = useState(ROUND_LIMIT_MS)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')
  const [reactionTimes, setReactionTimes] = useState<number[]>([])

  const roundStartRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setStatus('finished')
  }, [clearTimers])

  const startRound = useCallback(
    (nextRound: number) => {
      if (nextRound > TOTAL_ROUNDS) {
        finishGame()
        return
      }
      const data = buildRound(nextRound)
      setRoundData(data)
      setFeedback('none')
      setRound(nextRound)
      setTimeLeft(ROUND_LIMIT_MS)
      roundStartRef.current = Date.now()

      clearTimers()

      intervalRef.current = setInterval(() => {
        const remaining = ROUND_LIMIT_MS - (Date.now() - roundStartRef.current)
        if (remaining <= 0) {
          setTimeLeft(0)
        } else {
          setTimeLeft(remaining)
        }
      }, 50)

      timeoutRef.current = setTimeout(() => {
        setMisses((m) => m + 1)
        setFeedback('wrong')
        timeoutRef.current = null
        clearTimers()
        const advance = setTimeout(() => {
          startRound(nextRound + 1)
        }, 600)
        timeoutRef.current = advance
      }, ROUND_LIMIT_MS)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setScore(0)
    setMisses(0)
    setHits(0)
    setReactionTimes([])
    setRound(1)
    setStatus('playing')
    startRound(1)
  }, [startRound])

  const handleCellClick = (index: number) => {
    if (!roundData || feedback !== 'none') return
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    clearTimers()

    if (index === roundData.targetIndex) {
      const rt = Date.now() - roundStartRef.current
      setReactionTimes((prev) => [...prev, rt])
      // Per-round score = 100 × speedCoef × difficultyCoef
      const roundScore = Math.round(
        100 *
          speedCoefficient(rt, ROUND_LIMIT_MS) *
          difficultyCoefficient(round)
      )
      setScore((s) => s + roundScore)
      setHits((h) => h + 1)
      setFeedback('correct')
    } else {
      setMisses((m) => m + 1)
      setFeedback('wrong')
    }

    timeoutRef.current = setTimeout(() => {
      startRound(round + 1)
    }, 500)
  }

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  const accuracy =
    TOTAL_ROUNDS > 0 ? Math.round((hits / TOTAL_ROUNDS) * 100) : 0
  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((sum, rt) => sum + rt, 0) /
            reactionTimes.length
        )
      : 0
  // Final = max(0, Σ round scores − misses × 50)
  const finalScore = Math.max(0, score - misses * 50)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-attention/15">
            <Target className="h-8 w-8 text-dim-attention" />
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
          { label: t.misses, value: misses },
        ]}
      />
    )
  }

  const size = gridSizeForRound(round)

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
            <span className="text-xs text-text-muted">{t.misses}</span>
            <span className="text-md font-bold text-error">{misses}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-dim-attention-text">
            {t.findTarget}
          </span>
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={ROUND_LIMIT_MS}
          dimension="attention"
          showNumber
          roundLabel={`${t.round} ${round}/${TOTAL_ROUNDS}`}
        />

        <div
          className="grid gap-1.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            maxWidth: `${size * 64}px`,
          }}
        >
          {roundData?.cells.map((symbol, idx) => {
            const isTarget = idx === roundData.targetIndex
            const showCorrect = feedback === 'correct' && isTarget
            const showWrong = feedback === 'wrong' && isTarget
            return (
              <button
                key={`${round}-${idx}`}
                type="button"
                onClick={() => handleCellClick(idx)}
                aria-label={`cell-${idx}`}
                className={[
                  'flex h-14 w-14 items-center justify-center rounded-md border text-2xl transition-all',
                  'border-border bg-card hover:bg-primary-bg hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  showCorrect
                    ? 'border-success bg-success/15 text-success'
                    : '',
                  showWrong
                    ? 'border-error bg-error/15 text-error animate-shake'
                    : 'text-text-primary',
                ].join(' ')}
              >
                <span aria-hidden="true">{symbol}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
