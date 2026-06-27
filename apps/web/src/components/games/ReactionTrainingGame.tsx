'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Zap, Play, RotateCcw, Timer } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'waiting' | 'ready' | 'result'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  round: string
  score: string
  wait: string
  click: string
  tooSoon: string
  yourTime: string
  gameover: string
  playAgain: string
  avgTime: string
  bestTime: string
  finalScore: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Reaction Training',
    description:
      'Wait for the color to change, then tap as fast as you can. 20 rounds. Early tap = 0.',
    start: 'Start',
    round: 'Round',
    score: 'Score',
    wait: 'Wait...',
    click: 'Click!',
    tooSoon: 'Too soon!',
    yourTime: 'Your time',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    avgTime: 'Avg. Time',
    bestTime: 'Best Time',
    finalScore: 'Final Score',
  },
  zh: {
    title: '反应训练',
    description: '等待颜色变化后尽快点击。共 20 轮，提前点击 = 0 分。',
    start: '开始',
    round: '轮次',
    score: '得分',
    wait: '等待...',
    click: '点击！',
    tooSoon: '太早了！',
    yourTime: '你的时间',
    gameover: '游戏结束',
    playAgain: '再来一局',
    avgTime: '平均时间',
    bestTime: '最佳时间',
    finalScore: '最终得分',
  },
  ja: {
    title: '反応トレーニング',
    description: '色が変わったら素早くタップ。全20ラウンド、早押しは0点。',
    start: '開始',
    round: 'ラウンド',
    score: 'スコア',
    wait: '待機...',
    click: 'タップ！',
    tooSoon: '早すぎ！',
    yourTime: 'あなたの時間',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    avgTime: '平均時間',
    bestTime: 'ベストタイム',
    finalScore: '最終スコア',
  },
}

const TOTAL_ROUNDS = 20
const WAIT_MIN_MS = 1000
const WAIT_MAX_MS = 4000

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function randomWaitMs(): number {
  return WAIT_MIN_MS + Math.floor(Math.random() * (WAIT_MAX_MS - WAIT_MIN_MS))
}

export interface ReactionTrainingGameProps {
  locale: string
}

export function ReactionTrainingGame({ locale }: ReactionTrainingGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('waiting')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [lastTime, setLastTime] = useState<number | null>(null)
  const [lastFailed, setLastFailed] = useState(false)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])

  const startTimeRef = useRef<number>(0)
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (waitTimerRef.current !== null) {
      clearTimeout(waitTimerRef.current)
      waitTimerRef.current = null
    }
    if (resultTimerRef.current !== null) {
      clearTimeout(resultTimerRef.current)
      resultTimerRef.current = null
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
      setRound(nextRound)
      setPhase('waiting')
      setLastTime(null)
      setLastFailed(false)

      const waitMs = randomWaitMs()
      waitTimerRef.current = setTimeout(() => {
        startTimeRef.current = Date.now()
        setPhase('ready')
        waitTimerRef.current = null
      }, waitMs)
    },
    [finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setScore(0)
    setReactionTimes([])
    setRound(1)
    setStatus('playing')
    startRound(1)
  }, [startRound])

  const handleAreaClick = () => {
    if (status !== 'playing') return

    if (phase === 'waiting') {
      // false start
      if (waitTimerRef.current !== null) {
        clearTimeout(waitTimerRef.current)
        waitTimerRef.current = null
      }
      setLastFailed(true)
      setLastTime(null)
      setPhase('result')
      resultTimerRef.current = setTimeout(() => {
        startRound(round + 1)
      }, 1200)
      return
    }

    if (phase === 'ready') {
      const rt = Date.now() - startTimeRef.current
      const roundScore = Math.max(0, 500 - rt)
      setReactionTimes((prev) => [...prev, rt])
      setScore((s) => s + roundScore)
      setLastTime(rt)
      setLastFailed(false)
      setPhase('result')
      resultTimerRef.current = setTimeout(() => {
        startRound(round + 1)
      }, 1000)
    }
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const avgTime =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        )
      : 0
  const bestTime =
    reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-reaction/15">
            <Zap className="h-8 w-8 text-dim-reaction" />
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
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-reaction/15">
            <Timer className="h-8 w-8 text-dim-reaction" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{t.gameover}</h2>
          <div className="grid grid-cols-3 gap-md w-full max-w-md">
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.finalScore}</div>
              <div className="text-xl font-bold text-primary">{score}</div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.avgTime}</div>
              <div className="text-xl font-bold text-text-primary">
                {avgTime}ms
              </div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.bestTime}</div>
              <div className="text-xl font-bold text-text-primary">
                {bestTime}ms
              </div>
            </div>
          </div>
          <Button variant="primary" size="lg" onClick={startGame}>
            <RotateCcw className="mr-xs h-5 w-5" />
            {t.playAgain}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progressPercent = ((round - 1) / TOTAL_ROUNDS) * 100

  const areaClasses =
    phase === 'ready'
      ? 'bg-secondary text-white'
      : phase === 'waiting'
        ? 'bg-error text-white'
        : 'bg-card text-text-primary border-2 border-border'

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
        </div>

        <Progress
          value={progressPercent}
          dimension="default"
          className="h-1.5"
        />

        <button
          type="button"
          onClick={handleAreaClick}
          aria-label={phase === 'ready' ? t.click : t.wait}
          className={[
            'flex min-h-[280px] w-full flex-col items-center justify-center gap-md rounded-lg p-3xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            areaClasses,
          ].join(' ')}
        >
          {phase === 'waiting' && (
            <span className="text-3xl font-bold">{t.wait}</span>
          )}
          {phase === 'ready' && (
            <span className="text-5xl font-bold animate-pulse">{t.click}</span>
          )}
          {phase === 'result' && (
            <>
              <span className="text-3xl font-bold">
                {lastFailed ? t.tooSoon : `${lastTime}ms`}
              </span>
              <span className="text-sm opacity-90">
                {lastFailed ? '' : t.yourTime}
              </span>
            </>
          )}
        </button>
      </CardContent>
    </Card>
  )
}
