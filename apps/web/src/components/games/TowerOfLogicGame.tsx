'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameRules } from '@/components/games/GameRules'
import { Play } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  level: string
  moves: string
  optimal: string
  fails: string
  rules: string[]
  scoring: string[]
  tips: string[]
  invalid: string
  levelComplete: string
  levelFailed: string
  levelsCleared: string
  totalMoves: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Tower of Logic',
    description:
      'Move every disk from the left peg to the right peg. Bigger disks can never sit on smaller ones.',
    dimensionLabel: 'Executive',
    start: 'Start',
    level: 'Level',
    moves: 'Moves',
    optimal: 'Optimal',
    fails: 'Fails',
    rules: [
      'Click a peg to pick up its top disk, click another peg to drop it.',
      'A bigger disk can never be placed on a smaller disk.',
      'Move all disks to the rightmost peg to clear the level.',
      'Disks grow from 3 up to 7 across 5 levels.',
    ],
    scoring: [
      'Level score = max(100, optimal×100 − (moves−optimal)×50).',
      'Optimal moves = 2^disks − 1.',
      'Exceeding optimal×2 moves counts as a failed level.',
      '3 failed levels ends the game.',
    ],
    tips: [
      'Plan the whole sequence before your first move.',
      'Move smaller stacks first to free up space.',
    ],
    invalid: "Can't place there!",
    levelComplete: 'Level Clear!',
    levelFailed: 'Level Failed!',
    levelsCleared: 'Levels Cleared',
    totalMoves: 'Total Moves',
  },
  zh: {
    title: '逻辑之塔',
    description: '将所有圆盘从左柱移到右柱，大圆盘不能放在小圆盘上。',
    dimensionLabel: '执行',
    start: '开始',
    level: '关卡',
    moves: '步数',
    optimal: '最优',
    fails: '失败',
    rules: [
      '点击柱子拿起顶部圆盘，再点击另一柱放下。',
      '大圆盘不能放在小圆盘上。',
      '将所有圆盘移到最右柱即可过关。',
      '圆盘数从 3 递增至 7，共 5 关。',
    ],
    scoring: [
      '关卡分 = max(100, 最优×100 − (步数−最优)×50)。',
      '最优步数 = 2^圆盘数 − 1。',
      '步数超过最优×2 视为失败。',
      '3 次失败结束游戏。',
    ],
    tips: ['第一步前先规划整条路径。', '先移动较小的子塔腾出空间。'],
    invalid: '不能放在这里！',
    levelComplete: '过关！',
    levelFailed: '本关失败！',
    levelsCleared: '已过关卡',
    totalMoves: '总步数',
  },
  ja: {
    title: 'ロジックタワー',
    description: '全ディスクを左柱から右柱へ。大は小の上に置けません。',
    dimensionLabel: '実行',
    start: '開始',
    level: 'レベル',
    moves: '手数',
    optimal: '最適',
    fails: '失敗',
    rules: [
      '柱をクリックして一番上のディスクを拾い、別の柱に置く。',
      '大ディスクを小ディスクの上には置けない。',
      '全ディスクを右端の柱へ移動でクリア。',
      'ディスクは3個から7個へ、全5レベル。',
    ],
    scoring: [
      'レベルスコア = max(100, 最適×100 − (手数−最適)×50)。',
      '最適手数 = 2^ディスク数 − 1。',
      '最適×2を超えるとレベル失敗。',
      '3回失敗でゲーム終了。',
    ],
    tips: ['最初の手前に全体を計画。', '小さな塔から先に動かす。'],
    invalid: 'そこに置けません！',
    levelComplete: 'クリア！',
    levelFailed: 'レベル失敗！',
    levelsCleared: 'クリア数',
    totalMoves: '合計手数',
  },
}

const MAX_FAILS = 3
const TOTAL_LEVELS = 5
const DISK_COLORS = [
  '#FF6B35',
  '#FFB14A',
  '#FFD700',
  '#F472B6',
  '#FB7185',
  '#EC4899',
  '#F97316',
]

function disksForLevel(level: number): number {
  return level + 2
}
function optimalMoves(disks: number): number {
  return Math.pow(2, disks) - 1
}
function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function initialPegs(disks: number): number[][] {
  const first: number[] = []
  for (let i = disks; i >= 1; i--) first.push(i)
  return [first, [], []]
}

export interface TowerOfLogicGameProps {
  locale: Locale
}

export function TowerOfLogicGame({ locale }: TowerOfLogicGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [level, setLevel] = useState(1)
  const [pegs, setPegs] = useState<number[][]>([[], [], []])
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [fails, setFails] = useState(0)
  const [score, setScore] = useState(0)
  const [totalMoves, setTotalMoves] = useState(0)
  const [levelsCleared, setLevelsCleared] = useState(0)
  const [flash, setFlash] = useState<'none' | 'invalid' | 'clear' | 'fail'>(
    'none'
  )

  const failTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)
  const failsRef = useRef(0)

  const clearFlash = useCallback(() => {
    if (failTimerRef.current !== null) {
      clearTimeout(failTimerRef.current)
      failTimerRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearFlash()
    setStatus('finished')
  }, [clearFlash])

  const initLevel = useCallback(
    (lvl: number) => {
      const disks = disksForLevel(lvl)
      setPegs(initialPegs(disks))
      setSelectedPeg(null)
      setMoves(0)
      setFlash('none')
    },
    []
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    failsRef.current = 0
    setFails(0)
    setScore(0)
    setTotalMoves(0)
    setLevelsCleared(0)
    setLevel(1)
    setStatus('playing')
    initLevel(1)
  }, [initLevel])

  useEffect(() => {
    return () => clearFlash()
  }, [clearFlash])

  const disks = disksForLevel(level)
  const optimal = optimalMoves(disks)
  const failThreshold = optimal * 2

  const handlePegClick = (pegIdx: number) => {
    if (status !== 'playing' || flash !== 'none') return

    if (selectedPeg === null) {
      const peg = pegs[pegIdx]
      if (peg === undefined || peg.length === 0) return
      setSelectedPeg(pegIdx)
      return
    }

    if (selectedPeg === pegIdx) {
      setSelectedPeg(null)
      return
    }

    const fromPeg = pegs[selectedPeg]
    const toPeg = pegs[pegIdx]
    if (fromPeg === undefined || toPeg === undefined) {
      setSelectedPeg(null)
      return
    }
    const disk = fromPeg[fromPeg.length - 1]
    if (disk === undefined) {
      setSelectedPeg(null)
      return
    }
    const topTo = toPeg[toPeg.length - 1]
    if (topTo !== undefined && topTo < disk) {
      // invalid move
      setFlash('invalid')
      setSelectedPeg(null)
      failTimerRef.current = setTimeout(() => setFlash('none'), 700)
      return
    }

    // valid move
    const newFrom = fromPeg.slice(0, -1)
    const newTo = [...toPeg, disk]
    const nextPegs = pegs.map((p, i) => {
      if (i === selectedPeg) return newFrom
      if (i === pegIdx) return newTo
      return p
    })
    setPegs(nextPegs)
    setSelectedPeg(null)
    const nextMoves = moves + 1
    setMoves(nextMoves)
    setTotalMoves((m) => m + 1)

    // win check
    if (nextPegs[2] !== undefined && nextPegs[2].length === disks) {
      const levelScore = Math.max(
        100,
        optimal * 100 - (nextMoves - optimal) * 50
      )
      setScore((s) => s + levelScore)
      setLevelsCleared((c) => c + 1)
      setFlash('clear')
      failTimerRef.current = setTimeout(() => {
        if (level >= TOTAL_LEVELS) {
          finishGame()
        } else {
          const nextLvl = level + 1
          setLevel(nextLvl)
          initLevel(nextLvl)
        }
      }, 900)
      return
    }

    // fail check (exceed optimal*2)
    if (nextMoves > failThreshold) {
      const newFails = failsRef.current + 1
      failsRef.current = newFails
      setFails(newFails)
      setFlash('fail')
      failTimerRef.current = setTimeout(() => {
        if (newFails >= MAX_FAILS) {
          finishGame()
        } else {
          initLevel(level)
        }
      }, 1100)
    }
  }

  if (status === 'idle') {
    return (
      <GameRules
        t={tt}
        title={t.title}
        dimension="executive"
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
        dimension="executive"
        onRetry={startGame}
        stats={[
          { label: t.levelsCleared, value: `${levelsCleared}/${TOTAL_LEVELS}` },
          { label: t.totalMoves, value: totalMoves },
          { label: t.fails, value: `${fails}/${MAX_FAILS}` },
        ]}
      />
    )
  }

  const moveBudgetPercent = Math.min(
    100,
    (moves / Math.max(1, failThreshold)) * 100
  )
  const isOverOptimal = moves > optimal

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.level}</span>
            <span className="text-md font-bold text-text-primary">
              {level}/{TOTAL_LEVELS}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.moves}</span>
            <span className="text-md font-bold text-dim-executive-text">
              {moves}
            </span>
            <span className="text-xs text-text-muted">
              / {t.optimal} {optimal}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.fails}</span>
            <span className="text-md font-bold text-error">
              {fails}/{MAX_FAILS}
            </span>
          </div>
        </div>

        <Progress
          value={moveBudgetPercent}
          dimension={isOverOptimal ? 'error' : 'executive'}
          className="h-1.5"
        />

        <div className="flex items-center justify-center gap-xs min-h-[18px]">
          {flash === 'invalid' && (
            <span className="text-sm font-semibold text-error">{t.invalid}</span>
          )}
          {flash === 'clear' && (
            <span className="text-sm font-semibold text-dim-executive-text">
              {t.levelComplete}
            </span>
          )}
          {flash === 'fail' && (
            <span className="text-sm font-semibold text-error">
              {t.levelFailed}
            </span>
          )}
        </div>

        {/* Pegs */}
        <div className="grid grid-cols-3 gap-sm">
          {pegs.map((peg, pegIdx) => {
            const isSelected = selectedPeg === pegIdx
            return (
              <button
                key={pegIdx}
                type="button"
                onClick={() => handlePegClick(pegIdx)}
                aria-label={`${t.level} ${pegIdx + 1}`}
                className={[
                  'relative flex h-64 w-full flex-col-reverse items-center justify-start rounded-lg border-2 p-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isSelected
                    ? 'border-dim-executive bg-dim-executive/10'
                    : 'border-border bg-background-secondary hover:bg-primary-bg',
                ].join(' ')}
              >
                {/* base */}
                <div className="absolute bottom-2 h-1.5 w-3/4 rounded-full bg-text-muted/30" />
                {/* pole */}
                <div className="absolute bottom-3 top-4 w-1 rounded-full bg-text-muted/20" />
                {/* disks */}
                <div className="relative z-10 flex w-full flex-col-reverse items-center gap-xs pb-3">
                  {peg.map((disk, diskIdx) => {
                    const isTop = diskIdx === peg.length - 1
                    const widthPct = 30 + (disk / disks) * 65
                    const color = DISK_COLORS[(disk - 1) % DISK_COLORS.length]
                    return (
                      <div
                        key={disk}
                        className={[
                          'h-5 rounded-md text-center text-xs font-bold leading-5 text-white shadow-sm transition-transform',
                          isTop && isSelected ? '-translate-y-1 ring-2 ring-dim-executive' : '',
                        ].join(' ')}
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: color,
                        }}
                      >
                        {disk}
                      </div>
                    )
                  })}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
