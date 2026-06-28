'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ListOrdered, Play } from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'showing' | 'input' | 'feedback'

interface Texts {
  title: string
  description: string
  start: string
  level: string
  fails: string
  watch: string
  repeat: string
  correct: string
  wrong: string
  gameover: string
  playAgain: string
  maxLevel: string
  correctRounds: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Spatial Sequence',
    description:
      'Watch the sequence of lit tiles, then repeat it in order. Sequence grows each level.',
    start: 'Start',
    level: 'Level',
    fails: 'Fails',
    watch: 'Watch the sequence',
    repeat: 'Repeat the sequence',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    maxLevel: 'Max Level',
    correctRounds: 'Correct Rounds',
  },
  zh: {
    title: '空间序列',
    description: '观察亮起的格子顺序，然后按顺序重复。每关序列变长。',
    start: '开始',
    level: '关卡',
    fails: '失败',
    watch: '观察序列',
    repeat: '重复序列',
    correct: '正确！',
    wrong: '错误！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    maxLevel: '最高关卡',
    correctRounds: '正确轮数',
  },
  ja: {
    title: '空間シーケンス',
    description: '点灯したタイルの順序を観察し、順番に再現しよう。レベル毎に延長。',
    start: '開始',
    level: 'レベル',
    fails: '失敗',
    watch: 'シーケンスを観察',
    repeat: 'シーケンスを再現',
    correct: '正解！',
    wrong: '不正解！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    maxLevel: '最高レベル',
    correctRounds: '正解ラウンド',
  },
}

const MAX_FAILS = 3
const STEP_SHOW_MS = 600
const STEP_GAP_MS = 200

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function gridSizeForLevel(level: number): number {
  if (level >= 7) return 5
  if (level >= 4) return 4
  return 3
}

function sequenceLengthForLevel(level: number): number {
  return 2 + level
}

/** levelScore = sequenceLength × 150 × gridSize × (1 + (level-1) × 0.1) */
function levelScore(level: number): number {
  const seqLen = sequenceLengthForLevel(level)
  const gridSize = gridSizeForLevel(level)
  const multiplier = 1 + (level - 1) * 0.1
  return Math.round(seqLen * 150 * gridSize * multiplier)
}

function buildSequence(total: number, length: number): number[] {
  const seq: number[] = []
  for (let i = 0; i < length; i++) {
    seq.push(Math.floor(Math.random() * total))
  }
  return seq
}

export interface SpatialSequenceGameProps {
  locale: Locale
}

export function SpatialSequenceGame({ locale }: SpatialSequenceGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('showing')
  const [level, setLevel] = useState(1)
  const [sequence, setSequence] = useState<number[]>([])
  const [showStep, setShowStep] = useState(-1)
  const [input, setInput] = useState<number[]>([])
  const [fails, setFails] = useState(0)
  const [maxLevel, setMaxLevel] = useState(0)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimer()
    setStatus('finished')
  }, [clearTimer])

  // Drive the showing sequence: -1 = initial gap, 0..n-1 = show tile, n = done
  useEffect(() => {
    if (status !== 'playing' || phase !== 'showing') return
    if (showStep >= sequence.length) {
      setPhase('input')
      return
    }
    const isShowStep = showStep >= 0
    const delay = isShowStep ? STEP_SHOW_MS : STEP_GAP_MS
    timerRef.current = setTimeout(() => {
      setShowStep((s) => s + 1)
    }, delay)
    return () => clearTimer()
  }, [status, phase, showStep, sequence, clearTimer])

  const startLevel = useCallback((nextLevel: number) => {
    const size = gridSizeForLevel(nextLevel)
    const total = size * size
    const seqLen = sequenceLengthForLevel(nextLevel)
    const seq = buildSequence(total, seqLen)
    setLevel(nextLevel)
    setSequence(seq)
    setShowStep(-1)
    setInput([])
    setFeedback('none')
    setPhase('showing')
  }, [])

  const startGame = useCallback(() => {
    finishedRef.current = false
    setFails(0)
    setMaxLevel(0)
    setCorrectRounds(0)
    setScore(0)
    setLevel(1)
    setStatus('playing')
    startLevel(1)
  }, [startLevel])

  const handleCellClick = (index: number) => {
    if (phase !== 'input' || feedback !== 'none') return
    const expectedIndex = input.length
    const expected = sequence[expectedIndex]
    if (expected === undefined) return

    const nextInput = [...input, index]
    setInput(nextInput)

    if (index !== expected) {
      const newFails = fails + 1
      setFails(newFails)
      setFeedback('wrong')
      setPhase('feedback')
      if (newFails >= MAX_FAILS) {
        timerRef.current = setTimeout(() => finishGame(), 1000)
      } else {
        timerRef.current = setTimeout(() => {
          startLevel(level)
        }, 1000)
      }
      return
    }

    if (nextInput.length === sequence.length) {
      // Level completed — add level score
      const earned = levelScore(level)
      setScore((s) => s + earned)
      setCorrectRounds((c) => c + 1)
      setMaxLevel((m) => Math.max(m, level))
      setFeedback('correct')
      setPhase('feedback')
      timerRef.current = setTimeout(() => {
        startLevel(level + 1)
      }, 800)
    }
  }

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  // finalScore = max(0, Σ levelScores − fails × 100)
  const finalScore = Math.max(0, score - fails * 100)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <ListOrdered className="h-8 w-8 text-dim-memory" />
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
          { label: t.maxLevel, value: maxLevel },
          { label: t.correctRounds, value: correctRounds },
        ]}
      />
    )
  }

  const size = gridSizeForLevel(level)
  const failsPercent = (fails / MAX_FAILS) * 100
  const activeTile = phase === 'showing' ? sequence[showStep] : undefined
  const wrongIdx =
    phase === 'feedback' && feedback === 'wrong'
      ? (input[input.length - 1] ?? -1)
      : -1

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.level}</span>
            <span className="text-md font-bold text-text-primary">
              {level}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.fails}</span>
            <span className="text-md font-bold text-error">
              {fails}/{MAX_FAILS}
            </span>
          </div>
        </div>

        <Progress value={failsPercent} dimension="error" className="h-1.5" />

        <div className="flex items-center justify-center">
          <span
            className={[
              'text-sm font-semibold',
              phase === 'showing'
                ? 'text-dim-memory-text'
                : 'text-text-secondary',
            ].join(' ')}
          >
            {phase === 'showing' ? t.watch : t.repeat}
          </span>
        </div>

        <div
          className="grid gap-1.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            maxWidth: `${size * 56}px`,
          }}
        >
          {Array.from({ length: size * size }).map((_, idx) => {
            const isActive = activeTile === idx
            const isInput =
              (phase === 'input' ||
                (phase === 'feedback' && feedback === 'correct')) &&
              input.includes(idx)
            const isWrongFeedback = idx === wrongIdx
            return (
              <button
                key={`${level}-${idx}`}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={phase !== 'input' || feedback !== 'none'}
                aria-label={`cell-${idx}`}
                className={[
                  'h-12 w-12 rounded-md border-2 transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive
                    ? 'border-dim-memory bg-dim-memory'
                    : isWrongFeedback
                      ? 'border-error bg-error/15'
                      : isInput
                        ? feedback === 'correct'
                          ? 'border-success bg-success/20'
                          : 'border-dim-memory bg-dim-memory/50'
                        : 'border-border bg-card hover:bg-primary-bg',
                ].join(' ')}
              >
                {isActive || isInput ? (
                  <span className="block h-2 w-2 rounded-full bg-dim-memory mx-auto" />
                ) : null}
              </button>
            )
          })}
        </div>

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
