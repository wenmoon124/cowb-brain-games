'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Grid3x3, Play, RotateCcw } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'showing' | 'input' | 'feedback'

type Locale = 'en' | 'zh' | 'ja'

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
  finalScore: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Spatial Memory',
    description:
      'Memorize the highlighted cells, then tap them back. Grid grows each level. 3 fails ends the game.',
    start: 'Start',
    level: 'Level',
    fails: 'Fails',
    watch: 'Memorize',
    repeat: 'Repeat the pattern',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    maxLevel: 'Max Level',
    correctRounds: 'Correct Rounds',
    finalScore: 'Final Score',
  },
  zh: {
    title: '空间记忆',
    description: '记住高亮的格子，然后按顺序点击。每关网格变大，3次失败结束。',
    start: '开始',
    level: '关卡',
    fails: '失败',
    watch: '记忆中',
    repeat: '重复图案',
    correct: '正确！',
    wrong: '错误！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    maxLevel: '最高关卡',
    correctRounds: '正确轮数',
    finalScore: '最终得分',
  },
  ja: {
    title: '空間記憶',
    description: 'ハイライトされたセルを記憶し、再現しよう。レベル毎にグリッド拡大、3回失敗で終了。',
    start: '開始',
    level: 'レベル',
    fails: '失敗',
    watch: '記憶中',
    repeat: 'パターンを再現',
    correct: '正解！',
    wrong: '不正解！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    maxLevel: '最高レベル',
    correctRounds: '正解ラウンド',
    finalScore: '最終スコア',
  },
}

const MAX_FAILS = 3
const SHOW_MS = 2000

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function gridSizeForLevel(level: number): number {
  return Math.min(2 + level, 7)
}

function highlightCountForLevel(level: number): number {
  return level + 2
}

function buildHighlighted(total: number, count: number): number[] {
  const indices = Array.from({ length: total }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = indices[i]
    if (tmp !== undefined) {
      indices[i] = indices[j] as number
      indices[j] = tmp
    }
  }
  return indices.slice(0, count).sort((a, b) => a - b)
}

export interface SpatialMemoryGameProps {
  locale: string
}

export function SpatialMemoryGame({ locale }: SpatialMemoryGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('showing')
  const [level, setLevel] = useState(1)
  const [highlighted, setHighlighted] = useState<number[]>([])
  const [clicked, setClicked] = useState<number[]>([])
  const [fails, setFails] = useState(0)
  const [maxLevel, setMaxLevel] = useState(0)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')

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

  const startLevel = useCallback(
    (nextLevel: number) => {
      const size = gridSizeForLevel(nextLevel)
      const total = size * size
      const count = highlightCountForLevel(nextLevel)
      const cells = buildHighlighted(total, count)
      setLevel(nextLevel)
      setHighlighted(cells)
      setClicked([])
      setFeedback('none')
      setPhase('showing')
      showTimerRef.current = setTimeout(() => {
        setPhase('input')
        showTimerRef.current = null
      }, SHOW_MS)
    },
    []
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setFails(0)
    setMaxLevel(0)
    setCorrectRounds(0)
    setLevel(1)
    setStatus('playing')
    startLevel(1)
  }, [startLevel])

  const handleCellClick = (index: number) => {
    if (phase !== 'input' || feedback !== 'none') return
    if (clicked.includes(index)) return

    const isCorrect = highlighted.includes(index)
    if (!isCorrect) {
      const newFails = fails + 1
      setFails(newFails)
      setFeedback('wrong')
      setPhase('feedback')
      if (newFails >= MAX_FAILS) {
        feedbackTimerRef.current = setTimeout(() => finishGame(), 1000)
      } else {
        feedbackTimerRef.current = setTimeout(() => {
          startLevel(level)
        }, 1000)
      }
      return
    }

    const nextClicked = [...clicked, index]
    setClicked(nextClicked)

    if (nextClicked.length === highlighted.length) {
      setCorrectRounds((c) => c + 1)
      setMaxLevel((m) => Math.max(m, level))
      setFeedback('correct')
      setPhase('feedback')
      feedbackTimerRef.current = setTimeout(() => {
        startLevel(level + 1)
      }, 800)
    }
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const finalScore = maxLevel * 300 + correctRounds * 50

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <Grid3x3 className="h-8 w-8 text-dim-memory" />
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <Grid3x3 className="h-8 w-8 text-dim-memory" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{t.gameover}</h2>
          <div className="grid grid-cols-3 gap-md w-full max-w-md">
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.finalScore}</div>
              <div className="text-xl font-bold text-primary">
                {finalScore}
              </div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.maxLevel}</div>
              <div className="text-xl font-bold text-text-primary">
                {maxLevel}
              </div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.correctRounds}</div>
              <div className="text-xl font-bold text-text-primary">
                {correctRounds}
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

  const size = gridSizeForLevel(level)
  const failsPercent = (fails / MAX_FAILS) * 100

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
              phase === 'showing' ? 'text-dim-memory' : 'text-text-secondary',
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
            const isHighlighted = highlighted.includes(idx)
            const isClicked = clicked.includes(idx)
            const showHighlight = phase === 'showing' && isHighlighted
            const showClicked = phase === 'input' && isClicked
            const showReveal =
              (phase === 'feedback' || phase === 'input') && isHighlighted
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
                  showHighlight
                    ? 'border-dim-memory bg-dim-memory/30'
                    : showClicked
                      ? 'border-dim-memory bg-dim-memory/40'
                      : phase === 'feedback' && isHighlighted
                        ? feedback === 'wrong'
                          ? 'border-success bg-success/15'
                          : 'border-dim-memory bg-dim-memory/30'
                        : 'border-border bg-card hover:bg-primary-bg',
                ].join(' ')}
              >
                {showReveal || showHighlight || showClicked ? (
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
