'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LayoutGrid, Play } from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'showing' | 'input' | 'feedback'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  level: string
  lives: string
  watch: string
  repeat: string
  correct: string
  wrong: string
  gameover: string
  playAgain: string
  maxLevel: string
  correctRounds: string
  wrongTaps: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Memory Matrix',
    description:
      'Memorize the flashing tiles, then tap them back. Grid grows each level.',
    start: 'Start',
    level: 'Level',
    lives: 'Lives',
    watch: 'Memorize',
    repeat: 'Tap the tiles',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    maxLevel: 'Max Level',
    correctRounds: 'Correct Rounds',
    wrongTaps: 'Wrong Taps',
  },
  zh: {
    title: '记忆矩阵',
    description: '记住闪亮的格子，然后点击它们。每关数量增加。',
    start: '开始',
    level: '关卡',
    lives: '生命',
    watch: '记忆中',
    repeat: '点击格子',
    correct: '正确！',
    wrong: '错误！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    maxLevel: '最高关卡',
    correctRounds: '正确轮数',
    wrongTaps: '错误点击',
  },
  ja: {
    title: 'メモリーマトリックス',
    description: '点滅したタイルを記憶し、タップしよう。レベル毎に増加。',
    start: '開始',
    level: 'レベル',
    lives: 'ライフ',
    watch: '記憶中',
    repeat: 'タイルをタップ',
    correct: '正解！',
    wrong: '不正解！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    maxLevel: '最高レベル',
    correctRounds: '正解ラウンド',
    wrongTaps: '誤タップ',
  },
}

const MAX_FAILS = 3
const GRID_SIZE = 4
const TOTAL_TILES = GRID_SIZE * GRID_SIZE
const SHOW_MS = 1200

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function tilesCountForLevel(level: number): number {
  return Math.min(3 + (level - 1), 8)
}

/** levelScore = tilesCount × 100 × (1 + (level-1) × 0.15) */
function levelScore(level: number): number {
  const count = tilesCountForLevel(level)
  const multiplier = 1 + (level - 1) * 0.15
  return Math.round(count * 100 * multiplier)
}

function buildHighlighted(count: number): number[] {
  const indices = Array.from({ length: TOTAL_TILES }, (_, i) => i)
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

export interface MemoryMatrixGameProps {
  locale: string
}

export function MemoryMatrixGame({ locale }: MemoryMatrixGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('showing')
  const [level, setLevel] = useState(1)
  const [highlighted, setHighlighted] = useState<number[]>([])
  const [clicked, setClicked] = useState<number[]>([])
  const [lives, setLives] = useState(MAX_FAILS)
  const [wrongTaps, setWrongTaps] = useState(0)
  const [maxLevel, setMaxLevel] = useState(0)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [score, setScore] = useState(0)
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

  const startLevel = useCallback((nextLevel: number) => {
    const count = tilesCountForLevel(nextLevel)
    const cells = buildHighlighted(count)
    setLevel(nextLevel)
    setHighlighted(cells)
    setClicked([])
    setFeedback('none')
    setPhase('showing')
    showTimerRef.current = setTimeout(() => {
      setPhase('input')
      showTimerRef.current = null
    }, SHOW_MS)
  }, [])

  const startGame = useCallback(() => {
    finishedRef.current = false
    setLives(MAX_FAILS)
    setWrongTaps(0)
    setMaxLevel(0)
    setCorrectRounds(0)
    setScore(0)
    setLevel(1)
    setStatus('playing')
    startLevel(1)
  }, [startLevel])

  const handleCellClick = (index: number) => {
    if (phase !== 'input' || feedback !== 'none') return
    if (clicked.includes(index)) return

    const isCorrect = highlighted.includes(index)
    if (!isCorrect) {
      const newWrongTaps = wrongTaps + 1
      setWrongTaps(newWrongTaps)
      const newLives = lives - 1
      setLives(newLives)
      setFeedback('wrong')
      setPhase('feedback')
      if (newLives <= 0) {
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
      // Level completed — add level score
      const earned = levelScore(level)
      setScore((s) => s + earned)
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

  // finalScore = max(0, Σ levelScores − wrongTaps × 50)
  const finalScore = Math.max(0, score - wrongTaps * 50)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <LayoutGrid className="h-8 w-8 text-dim-memory" />
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
        dimension="memory"
        onRetry={startGame}
        stats={[
          { label: t.maxLevel, value: maxLevel },
          { label: t.correctRounds, value: correctRounds },
          { label: t.wrongTaps, value: wrongTaps },
        ]}
      />
    )
  }

  const livesPercent = (lives / MAX_FAILS) * 100

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
            <span className="text-xs text-text-muted">{t.lives}</span>
            <span className="text-md font-bold text-error">
              {lives}/{MAX_FAILS}
            </span>
          </div>
        </div>

        <Progress value={livesPercent} dimension="memory" className="h-1.5" />

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
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            maxWidth: `${GRID_SIZE * 56}px`,
          }}
        >
          {Array.from({ length: TOTAL_TILES }).map((_, idx) => {
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
                    ? 'border-dim-memory bg-dim-memory'
                    : showClicked
                      ? 'border-dim-memory bg-dim-memory/50'
                      : phase === 'feedback' && isHighlighted
                        ? feedback === 'wrong'
                          ? 'border-error bg-error/15'
                          : 'border-dim-memory bg-dim-memory'
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
