'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Timer } from 'lucide-react'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  score: string
  item: string
  lives: string
  tapWhenYouSee: string
  target: string
  tap: string
  hits: string
  misses: string
  falseAlarms: string
  avgReaction: string
  hit: string
  miss: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Attention Span',
    description:
      'Watch the stream. Tap only when you see the target. Stay focused!',
    start: 'Start',
    score: 'Score',
    item: 'Item',
    lives: 'Lives',
    tapWhenYouSee: 'Tap when you see',
    target: 'Target',
    tap: 'TAP',
    hits: 'Hits',
    misses: 'Misses',
    falseAlarms: 'False Alarms',
    avgReaction: 'Avg. Reaction',
    hit: 'Hit!',
    miss: 'Missed!',
  },
  zh: {
    title: '持续注意',
    description: '观察数据流，仅在看到目标时点击。保持专注！',
    start: '开始',
    score: '得分',
    item: '项目',
    lives: '生命',
    tapWhenYouSee: '看到时点击',
    target: '目标',
    tap: '点击',
    hits: '命中',
    misses: '错过',
    falseAlarms: '误报',
    avgReaction: '平均反应',
    hit: '命中！',
    miss: '错过！',
  },
  ja: {
    title: 'アテンションスパン',
    description: 'ストリームを観察し、目標が出た時だけタップ。集中を保とう！',
    start: '開始',
    score: 'スコア',
    item: 'アイテム',
    lives: 'ライフ',
    tapWhenYouSee: '出たらタップ',
    target: 'ターゲット',
    tap: 'タップ',
    hits: '命中',
    misses: 'ミス',
    falseAlarms: '誤報',
    avgReaction: '平均反応',
    hit: '命中！',
    miss: 'ミス！',
  },
}

const TOTAL_ITEMS = 40
const ITEM_INTERVAL_MS = 1500 // items appear every 1.5s
const ITEM_VISIBLE_MS = 1200 // items stay for 1.2s
const REACTION_LIMIT_MS = 1200 // for speed coefficient
const MAX_LIVES = 3
const TARGET_VALUE = 7
const NON_TARGET_VALUES = [0, 1, 2, 3, 4, 5, 6, 8, 9] as const

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

/** Target probability by item tier: 30% → 20% → 15% (vigilance gets harder) */
function targetProbabilityForItem(itemIndex: number): number {
  if (itemIndex < 14) return 0.3
  if (itemIndex < 28) return 0.2
  return 0.15
}

/** Speed coefficient: clamp(1.5 - reactionTime/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

function pickNonTarget(): number {
  const idx = Math.floor(Math.random() * NON_TARGET_VALUES.length)
  const val = NON_TARGET_VALUES[idx]
  if (val === undefined) return 0
  return val
}

interface ItemData {
  value: number
  isTarget: boolean
}

function buildItems(): ItemData[] {
  const items: ItemData[] = []
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const isTarget = Math.random() < targetProbabilityForItem(i)
    items.push({
      value: isTarget ? TARGET_VALUE : pickNonTarget(),
      isTarget,
    })
  }
  // Ensure at least one target exists
  if (!items.some((it) => it.isTarget)) {
    const first = items[0]
    if (first) {
      first.isTarget = true
      first.value = TARGET_VALUE
    }
  }
  return items
}

export interface AttentionSpanGameProps {
  locale: string
}

export function AttentionSpanGame({ locale }: AttentionSpanGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [itemIndex, setItemIndex] = useState(0)
  const [currentItem, setCurrentItem] = useState<ItemData | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [falseAlarms, setFalseAlarms] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')
  const [showItem, setShowItem] = useState(false)

  const itemsRef = useRef<ItemData[]>([])
  const itemStartRef = useRef(0)
  const visibleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const respondedRef = useRef(false)
  const finishedRef = useRef(false)
  const livesRef = useRef(MAX_LIVES)

  const clearTimers = useCallback(() => {
    if (visibleTimeoutRef.current !== null) {
      clearTimeout(visibleTimeoutRef.current)
      visibleTimeoutRef.current = null
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
    setCurrentItem(null)
    setShowItem(false)
    setStatus('finished')
  }, [clearTimers])

  const showNextItem = useCallback(
    (index: number) => {
      if (finishedRef.current) return
      if (index >= TOTAL_ITEMS || livesRef.current <= 0) {
        finishGame()
        return
      }
      const items = itemsRef.current
      const item = items[index]
      if (!item) {
        finishGame()
        return
      }
      setItemIndex(index)
      setCurrentItem(item)
      setFeedback('none')
      setShowItem(true)
      respondedRef.current = false
      itemStartRef.current = Date.now()

      clearTimers()

      // After visible time, hide item. If target and not responded → miss.
      visibleTimeoutRef.current = setTimeout(() => {
        setShowItem(false)
        if (!respondedRef.current && item.isTarget) {
          setMisses((m) => m + 1)
          livesRef.current = Math.max(0, livesRef.current - 1)
          setLives(livesRef.current)
          setFeedback('wrong')
          if (livesRef.current <= 0) {
            advanceTimeoutRef.current = setTimeout(
              () => finishGame(),
              700
            )
            return
          }
        }
        // Gap before next item
        advanceTimeoutRef.current = setTimeout(() => {
          showNextItem(index + 1)
        }, ITEM_INTERVAL_MS - ITEM_VISIBLE_MS)
      }, ITEM_VISIBLE_MS)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    itemsRef.current = buildItems()
    livesRef.current = MAX_LIVES
    setScore(0)
    setLives(MAX_LIVES)
    setHits(0)
    setMisses(0)
    setFalseAlarms(0)
    setReactionTimes([])
    setItemIndex(0)
    setCurrentItem(null)
    setFeedback('none')
    setShowItem(false)
    setStatus('playing')
    showNextItem(0)
  }, [showNextItem])

  const handleTap = () => {
    if (!currentItem || feedback !== 'none' || !showItem) return
    if (respondedRef.current) return
    respondedRef.current = true
    const rt = Date.now() - itemStartRef.current
    clearTimers()

    if (currentItem.isTarget) {
      setReactionTimes((prev) => [...prev, rt])
      // hitScore = 100 × speedCoef
      const hitScore = Math.round(
        100 * speedCoefficient(rt, REACTION_LIMIT_MS)
      )
      setScore((s) => s + hitScore)
      setHits((h) => h + 1)
      setFeedback('correct')
    } else {
      setFalseAlarms((f) => f + 1)
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
      setFeedback('wrong')
    }

    setShowItem(false)

    if (livesRef.current <= 0) {
      advanceTimeoutRef.current = setTimeout(() => finishGame(), 700)
      return
    }

    advanceTimeoutRef.current = setTimeout(() => {
      showNextItem(itemIndex + 1)
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
  // finalScore = max(0, Σ hitScores - misses × 80 - falseAlarms × 60)
  const finalScore = Math.max(0, score - misses * 80 - falseAlarms * 60)
  const totalDecisions = hits + misses + falseAlarms
  const accuracy =
    totalDecisions > 0 ? Math.round((hits / totalDecisions) * 100) : 0

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-attention/15">
            <Timer className="h-8 w-8 text-dim-attention" />
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
          { label: t.misses, value: misses },
          { label: t.falseAlarms, value: falseAlarms },
        ]}
      />
    )
  }

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.item}</span>
            <span className="text-md font-bold text-text-primary">
              {itemIndex + 1}/{TOTAL_ITEMS}
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
            {t.tapWhenYouSee}{' '}
            <span className="text-dim-attention">{TARGET_VALUE}</span>
          </span>
        </div>

        <div
          className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-background-secondary"
          aria-live="polite"
        >
          {showItem && currentItem ? (
            <span
              key={`${itemIndex}-${currentItem.value}`}
              className="select-none text-6xl font-bold text-text-primary animate-scale-in"
            >
              {currentItem.value}
            </span>
          ) : (
            <span
              className={[
                'text-lg font-bold',
                feedback === 'correct' ? 'text-success' : '',
                feedback === 'wrong' ? 'text-error' : '',
                feedback === 'none' ? 'text-text-muted text-sm' : '',
              ].join(' ')}
            >
              {feedback === 'correct' && t.hit}
              {feedback === 'wrong' && t.miss}
              {feedback === 'none' && '—'}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleTap}
          disabled={!showItem || feedback !== 'none'}
          className="w-full"
          aria-label={t.tap}
        >
          {t.tap}
        </Button>
      </CardContent>
    </Card>
  )
}
