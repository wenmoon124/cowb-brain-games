'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameRules } from '@/components/games/GameRules'
import { Target, Play } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  round: string
  score: string
  hit: string
  miss: string
  rules: string[]
  scoring: string[]
  tips: string[]
  avgRt: string
  hits: string
  misses: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Click Horizon',
    description:
      'Targets pop up and drift across the field. Tap them before they vanish. 20 rounds.',
    dimensionLabel: 'Reaction',
    start: 'Start',
    round: 'Round',
    score: 'Score',
    hit: 'Hit!',
    miss: 'Missed!',
    rules: [
      'A target appears at a random spot and may start to drift.',
      'Tap it as fast as you can to score.',
      'If a target vanishes before you tap it, you lose points.',
      '20 rounds total — targets shrink and get faster each tier.',
    ],
    scoring: [
      'Hit score = clamp(1000 - reaction ms, 50, 1000) × difficulty (1.0–2.0).',
      'Miss = -100.',
      'Total = sum of all rounds.',
    ],
    tips: [
      'Keep your finger close to the play area.',
      'Aim for the center of each target.',
    ],
    avgRt: 'Avg. Time',
    hits: 'Hits',
    misses: 'Misses',
  },
  zh: {
    title: '点击地平线',
    description: '目标会在随机位置出现并漂移，在它们消失前点击。共 20 轮。',
    dimensionLabel: '反应',
    start: '开始',
    round: '轮次',
    score: '得分',
    hit: '命中！',
    miss: '错过！',
    rules: [
      '目标会在随机位置出现，并可能开始漂移。',
      '尽快点击它以得分。',
      '若目标消失前未点击，将扣分。',
      '共 20 轮——目标逐渐变小、变快。',
    ],
    scoring: [
      '命中分 = clamp(1000 - 反应ms, 50, 1000) × 难度(1.0–2.0)。',
      '错过 = -100。',
      '总分 = 各轮之和。',
    ],
    tips: ['手指贴近操作区。', '瞄准目标中心。'],
    avgRt: '平均时间',
    hits: '命中',
    misses: '错过',
  },
  ja: {
    title: 'クリックホライズン',
    description: 'ターゲットが現れ流れます。消える前にタップ。全20ラウンド。',
    dimensionLabel: '反応',
    start: '開始',
    round: 'ラウンド',
    score: 'スコア',
    hit: '命中！',
    miss: 'missed!',
    rules: [
      'ターゲットがランダムな位置に現れ、流れることがあります。',
      '素早くタップして得点。',
      '消える前にタップできないと減点。',
      '全20ラウンド—ターゲットは小さく速くなります。',
    ],
    scoring: [
      '命中 = clamp(1000 - 反応ms, 50, 1000) × 難易度(1.0–2.0)。',
      'missed = -100。',
      '合計 = 全ラウンドの合計。',
    ],
    tips: ['指を操作域の近くに。', 'ターゲットの中心を狙う。'],
    avgRt: '平均時間',
    hits: '命中',
    misses: 'miss',
  },
}

const TOTAL_ROUNDS = 20

interface Tier {
  size: number
  dwell: number
  coeff: number
  moveEvery: number | null
}

function tierForRound(round: number): Tier {
  if (round <= 5) return { size: 80, dwell: 3000, coeff: 1.0, moveEvery: null }
  if (round <= 10) return { size: 60, dwell: 2000, coeff: 1.33, moveEvery: 1000 }
  if (round <= 15) return { size: 40, dwell: 1500, coeff: 1.66, moveEvery: 750 }
  return { size: 30, dwell: 1000, coeff: 2.0, moveEvery: 500 }
}

function randomPos(): { x: number; y: number } {
  return {
    x: 5 + Math.random() * 80,
    y: 12 + Math.random() * 70,
  }
}

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

export interface ClickHorizonGameProps {
  locale: Locale
}

export function ClickHorizonGame({ locale }: ClickHorizonGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState<{
    x: number
    y: number
    size: number
  } | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'hit' | 'miss'>('none')
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])

  const roundStartRef = useRef(0)
  const dwellTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (dwellTimeoutRef.current !== null) {
      clearTimeout(dwellTimeoutRef.current)
      dwellTimeoutRef.current = null
    }
    if (moveIntervalRef.current !== null) {
      clearInterval(moveIntervalRef.current)
      moveIntervalRef.current = null
    }
    if (tickIntervalRef.current !== null) {
      clearInterval(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
    if (advanceTimeoutRef.current !== null) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setTarget(null)
    setStatus('finished')
  }, [clearTimers])

  const startRound = useCallback(
    (n: number) => {
      if (n > TOTAL_ROUNDS) {
        finishGame()
        return
      }
      const tier = tierForRound(n)
      setRound(n)
      setFeedback('none')
      setTarget({ ...randomPos(), size: tier.size })
      setTimeLeft(tier.dwell)
      roundStartRef.current = Date.now()

      clearTimers()

      tickIntervalRef.current = setInterval(() => {
        const remaining = tier.dwell - (Date.now() - roundStartRef.current)
        setTimeLeft(remaining > 0 ? remaining : 0)
      }, 50)

      if (tier.moveEvery !== null) {
        moveIntervalRef.current = setInterval(() => {
          setTarget((prev) =>
            prev ? { ...randomPos(), size: prev.size } : prev
          )
        }, tier.moveEvery)
      }

      dwellTimeoutRef.current = setTimeout(() => {
        // miss
        setMisses((m) => m + 1)
        setScore((s) => s - 100)
        setFeedback('miss')
        setTarget(null)
        clearTimers()
        advanceTimeoutRef.current = setTimeout(() => startRound(n + 1), 600)
      }, tier.dwell)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setScore(0)
    setHits(0)
    setMisses(0)
    setReactionTimes([])
    setRound(1)
    setStatus('playing')
    startRound(1)
  }, [startRound])

  const handleTargetClick = () => {
    if (!target || feedback !== 'none') return
    const rt = Date.now() - roundStartRef.current
    const tier = tierForRound(round)
    const base = Math.min(1000, Math.max(50, 1000 - rt))
    const gained = Math.round(base * tier.coeff)
    setScore((s) => s + gained)
    setHits((h) => h + 1)
    setReactionTimes((prev) => [...prev, rt])
    setFeedback('hit')
    setTarget(null)
    clearTimers()
    advanceTimeoutRef.current = setTimeout(() => startRound(round + 1), 450)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const avgRt =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0
  const accuracy =
    hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0

  if (status === 'idle') {
    return (
      <GameRules
        t={tt}
        title={t.title}
        dimension="reaction"
        dimensionLabel={t.dimensionLabel}
        rules={t.rules}
        scoring={t.scoring}
        tips={t.tips}
      >
        <Button variant="primary" size="lg" onClick={startGame}>
          <Play className="mr-xs h-5 w-5" />
          {t.start}
        </Button>
      </GameRules>
    )
  }

  if (status === 'finished') {
    return (
      <GameResult
        t={tt}
        score={score}
        accuracy={accuracy}
        dimension="reaction"
        onRetry={startGame}
        stats={[
          { label: t.avgRt, value: `${avgRt}ms` },
          { label: t.hits, value: hits },
          { label: t.misses, value: misses },
        ]}
      />
    )
  }

  const tier = tierForRound(round)

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {t.round} {round}/{TOTAL_ROUNDS}
          </span>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.score}</span>
            <span className="text-md font-bold text-dim-reaction-text">
              {score}
            </span>
          </div>
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={tier.dwell}
          dimension="reaction"
          showNumber
          roundLabel={`${t.round} ${round}/${TOTAL_ROUNDS}`}
        />

        <div
          className="relative w-full overflow-hidden rounded-lg bg-background-secondary"
          style={{ height: 340 }}
        >
          {target ? (
            <button
              type="button"
              onClick={handleTargetClick}
              aria-label={t.hit}
              className="absolute rounded-full bg-dim-reaction shadow-glow-reaction transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                width: target.size,
                height: target.size,
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="absolute inset-2 rounded-full bg-white/60" />
              <span className="absolute inset-0 flex items-center justify-center">
                <Target className="h-1/2 w-1/2 text-dim-reaction-text" />
              </span>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center">
              {feedback === 'hit' && (
                <span className="text-2xl font-bold text-dim-reaction-text">
                  {t.hit}
                </span>
              )}
              {feedback === 'miss' && (
                <span className="text-2xl font-bold text-error">{t.miss}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
