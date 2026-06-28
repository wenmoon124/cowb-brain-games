'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Shapes,
  Play,
  Circle,
  Square,
  Triangle,
  Star,
  Heart,
  Diamond,
  Check,
  X,
} from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'showing' | 'comparison' | 'feedback'

interface Texts {
  title: string
  description: string
  start: string
  round: string
  lives: string
  memorize: string
  compare: string
  match: string
  different: string
  correct: string
  wrong: string
  gameover: string
  playAgain: string
  roundsCompleted: string
  errors: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Pattern Match',
    description:
      'Memorize the pattern, then spot what changed. 20 rounds, 3 lives.',
    start: 'Start',
    round: 'Round',
    lives: 'Lives',
    memorize: 'Memorize the pattern',
    compare: 'Does it match?',
    match: 'Match',
    different: 'Different',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    roundsCompleted: 'Rounds Completed',
    errors: 'Errors',
  },
  zh: {
    title: '图案匹配',
    description: '记住图案，然后找出变化。共 20 轮，3 条命。',
    start: '开始',
    round: '轮次',
    lives: '生命',
    memorize: '记忆图案',
    compare: '是否相同？',
    match: '相同',
    different: '不同',
    correct: '正确！',
    wrong: '错误！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    roundsCompleted: '完成轮数',
    errors: '错误数',
  },
  ja: {
    title: 'パターンマッチ',
    description: 'パターンを記憶し、変化を見つけよう。全20ラウンド、ライフ3。',
    start: '開始',
    round: 'ラウンド',
    lives: 'ライフ',
    memorize: 'パターンを記憶',
    compare: '一致しますか？',
    match: '一致',
    different: '不一致',
    correct: '正解！',
    wrong: '不正解！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    roundsCompleted: '完了ラウンド',
    errors: 'エラー数',
  },
}

const MAX_ROUNDS = 20
const MAX_FAILS = 3
const SHOW_MS = 3000
const FEEDBACK_MS = 1000
const SPEED_LIMIT_MS = 5000

type SymbolIcon = ComponentType<{ className?: string | undefined }>

const SYMBOLS: SymbolIcon[] = [Circle, Square, Triangle, Star, Heart, Diamond]

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function configForRound(round: number): { gridSize: number; symbolCount: number } {
  if (round <= 5) return { gridSize: 2, symbolCount: 4 }
  if (round <= 10) return { gridSize: 3, symbolCount: 5 }
  return { gridSize: 4, symbolCount: 6 }
}

/** difficultyCoef = 1.0 + floor((round-1)/5) × 0.4, capped at 3.0 */
function difficultyCoefForRound(round: number): number {
  return Math.min(3.0, 1.0 + Math.floor((round - 1) / 5) * 0.4)
}

/** speedCoef = clamp(1.5 - rt/limit, 0.5, 1.5) */
function speedCoefFor(rt: number): number {
  return Math.min(1.5, Math.max(0.5, 1.5 - rt / SPEED_LIMIT_MS))
}

/** roundScore = 100 × speedCoef × difficultyCoef */
function roundScore(rt: number, round: number): number {
  const speed = speedCoefFor(rt)
  const difficulty = difficultyCoefForRound(round)
  return Math.round(100 * speed * difficulty)
}

function generatePattern(total: number, symbolCount: number): number[] {
  const pattern: number[] = []
  for (let i = 0; i < total; i++) {
    pattern.push(Math.floor(Math.random() * symbolCount))
  }
  return pattern
}

function generateComparison(
  pattern: number[],
  symbolCount: number
): { comparison: number[]; isMatch: boolean } {
  // 50% chance of match, 50% chance of differ
  const isMatch = Math.random() < 0.5
  if (isMatch) {
    return { comparison: [...pattern], isMatch: true }
  }
  // Differ in 1-2 positions
  const comparison = [...pattern]
  const total = pattern.length
  const changes = Math.min(total, Math.floor(Math.random() * 2) + 1)
  const positions = new Set<number>()
  while (positions.size < changes) {
    positions.add(Math.floor(Math.random() * total))
  }
  positions.forEach((pos) => {
    const original = comparison[pos]
    if (original !== undefined) {
      let newSymbol: number
      do {
        newSymbol = Math.floor(Math.random() * symbolCount)
      } while (newSymbol === original)
      comparison[pos] = newSymbol
    }
  })
  return { comparison, isMatch: false }
}

export interface PatternMatchGameProps {
  locale: Locale
}

export function PatternMatchGame({ locale }: PatternMatchGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('showing')
  const [round, setRound] = useState(1)
  const [pattern, setPattern] = useState<number[]>([])
  const [comparison, setComparison] = useState<number[]>([])
  const [actualIsMatch, setActualIsMatch] = useState(true)
  const [lives, setLives] = useState(MAX_FAILS)
  const [errors, setErrors] = useState(0)
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')
  const [roundStartTime, setRoundStartTime] = useState(0)

  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current)
      feedbackTimerRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setStatus('finished')
  }, [clearTimers])

  const startRound = useCallback((nextRound: number) => {
    const { gridSize, symbolCount } = configForRound(nextRound)
    const total = gridSize * gridSize
    const newPattern = generatePattern(total, symbolCount)
    const { comparison: newComparison, isMatch } = generateComparison(
      newPattern,
      symbolCount
    )
    setRound(nextRound)
    setPattern(newPattern)
    setComparison(newComparison)
    setActualIsMatch(isMatch)
    setFeedback('none')
    setPhase('showing')
    showTimerRef.current = setTimeout(() => {
      setPhase('comparison')
      setRoundStartTime(Date.now())
      showTimerRef.current = null
    }, SHOW_MS)
  }, [])

  const startGame = useCallback(() => {
    finishedRef.current = false
    setLives(MAX_FAILS)
    setErrors(0)
    setRoundsCompleted(0)
    setScore(0)
    setRound(1)
    setStatus('playing')
    startRound(1)
  }, [startRound])

  const handleAnswer = (userSaysMatch: boolean) => {
    if (phase !== 'comparison' || feedback !== 'none') return
    const rt = Date.now() - roundStartTime
    const correct = userSaysMatch === actualIsMatch
    if (correct) {
      const earned = roundScore(rt, round)
      setScore((s) => s + earned)
      setRoundsCompleted((c) => c + 1)
      setFeedback('correct')
    } else {
      setErrors((e) => e + 1)
      setLives((l) => l - 1)
      setFeedback('wrong')
    }
    setPhase('feedback')

    const isLastRound = round >= MAX_ROUNDS
    const noLivesLeft = !correct && lives - 1 <= 0

    if (isLastRound || noLivesLeft) {
      feedbackTimerRef.current = setTimeout(() => finishGame(), FEEDBACK_MS)
    } else {
      feedbackTimerRef.current = setTimeout(() => {
        startRound(round + 1)
      }, FEEDBACK_MS)
    }
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  // finalScore = max(0, Σ roundScores − errors × 60)
  const finalScore = Math.max(0, score - errors * 60)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <Shapes className="h-8 w-8 text-dim-memory" />
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
        t={tt}
        score={finalScore}
        dimension="memory"
        onRetry={startGame}
        stats={[
          { label: t.roundsCompleted, value: roundsCompleted },
          { label: t.errors, value: errors },
        ]}
      />
    )
  }

  const { gridSize } = configForRound(round)
  const livesPercent = (lives / MAX_FAILS) * 100
  const roundPercent = ((round - 1) / MAX_ROUNDS) * 100
  const displayPattern = phase === 'showing' ? pattern : comparison

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.round}</span>
            <span className="text-md font-bold text-text-primary">
              {round}/{MAX_ROUNDS}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.lives}</span>
            <span className="text-md font-bold text-error">
              {lives}/{MAX_FAILS}
            </span>
          </div>
        </div>

        <Progress value={roundPercent} dimension="memory" className="h-1.5" />
        <Progress value={livesPercent} dimension="error" className="h-1.5" />

        <div className="flex items-center justify-center">
          <span
            className={[
              'text-sm font-semibold',
              phase === 'showing'
                ? 'text-dim-memory-text'
                : 'text-text-secondary',
            ].join(' ')}
          >
            {phase === 'showing' ? t.memorize : t.compare}
          </span>
        </div>

        <div
          className="grid gap-1.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${gridSize * 56}px`,
          }}
        >
          {displayPattern.map((symbolIdx, idx) => {
            const Symbol = SYMBOLS[symbolIdx] ?? Circle
            return (
              <div
                key={`${round}-${idx}`}
                className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-border bg-card"
              >
                <Symbol className="h-6 w-6 text-dim-memory" />
              </div>
            )
          })}
        </div>

        {phase === 'comparison' && feedback === 'none' && (
          <div className="grid grid-cols-2 gap-md">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(true)}
              className="h-14"
            >
              <Check className="mr-xs h-5 w-5" />
              {t.match}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(false)}
              className="h-14"
            >
              <X className="mr-xs h-5 w-5" />
              {t.different}
            </Button>
          </div>
        )}

        {feedback !== 'none' && (
          <div className="flex items-center justify-center">
            <span
              className={[
                'text-sm font-semibold',
                feedback === 'correct' ? 'text-success' : 'text-error',
              ].join(' ')}
            >
              {feedback === 'correct' ? t.correct : t.wrong}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
