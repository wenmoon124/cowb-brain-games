'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameRules } from '@/components/games/GameRules'
import { Route, Play } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'

interface Cell {
  r: number
  c: number
}

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  level: string
  steps: string
  optimal: string
  rules: string[]
  scoring: string[]
  tips: string[]
  reached: string
  timeout: string
  reset: string
  levelsCleared: string
  timeouts: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Path Finder',
    description:
      'Trace the shortest route from start to end across a walled grid. 5 levels, 60s each, 3 timeouts allowed.',
    dimensionLabel: 'Executive',
    start: 'Start',
    level: 'Level',
    steps: 'Steps',
    optimal: 'Optimal',
    rules: [
      'Click an open cell next to your path end to extend the route.',
      'Click a cell already in your path to backtrack to it.',
      'Walls are blocked — you cannot cross them.',
      'Reach the goal cell before the 60s timer runs out.',
      '3 timeouts end the game immediately.',
    ],
    scoring: [
      'Level score = max(100, (optimal − steps + 10) × 50).',
      'Shorter paths score higher; optimal play earns the most.',
      'Timeout = 0 for that level.',
      'Total = sum of all 5 levels.',
    ],
    tips: [
      'Plan with the fewest turns in mind.',
      'Use backtrack to undo dead ends.',
    ],
    reached: 'Goal Reached!',
    timeout: 'Time Up!',
    reset: 'Reset Path',
    levelsCleared: 'Levels Cleared',
    timeouts: 'Timeouts',
  },
  zh: {
    title: '寻路者',
    description: '在带墙网格中从起点到终点描绘最短路径。共 5 关，每关 60 秒，3 次超时即结束。',
    dimensionLabel: '执行',
    start: '开始',
    level: '关卡',
    steps: '步数',
    optimal: '最优',
    rules: [
      '点击路径末端相邻的空格延伸路径。',
      '点击已在路径中的格子可回退到该处。',
      '墙体不可穿越。',
      '在 60 秒内到达终点。',
      '3 次超时将立即结束游戏。',
    ],
    scoring: [
      '关卡分 = max(100, (最优 − 步数 + 10) × 50)。',
      '路径越短分越高，最优路径得分最高。',
      '超时 = 0 分。',
      '总分 = 5 关之和。',
    ],
    tips: ['以最少转弯规划路径。', '用回退撤销死路。'],
    reached: '到达终点！',
    timeout: '时间到！',
    reset: '重置路径',
    levelsCleared: '已过关卡',
    timeouts: '超时',
  },
  ja: {
    title: 'パスファインダー',
    description: '壁のあるグリッドで最短経路を描く。全5レベル、各60秒、タイムアウト3回で終了。',
    dimensionLabel: '実行',
    start: '開始',
    level: 'レベル',
    steps: '歩数',
    optimal: '最適',
    rules: [
      '経路の端に隣接する空きマスをクリックして延ばす。',
      '経路内のマスをクリックでそこまで戻る。',
      '壁は通過できない。',
      '60秒以内にゴールマスに到達。',
      'タイムアウト3回で即終了。',
    ],
    scoring: [
      'レベルスコア = max(100, (最適 − 歩数 + 10) × 50)。',
      '短いほど高得点、最適経路が最高。',
      'タイムアウト = 0。',
      '合計 = 5レベルの合計。',
    ],
    tips: ['ターン数を最小に計画。', '行き止まりは戻ってやり直す。'],
    reached: 'ゴール到達！',
    timeout: '時間切れ！',
    reset: '経路リセット',
    levelsCleared: 'クリア数',
    timeouts: 'タイムアウト',
  },
}

const TOTAL_LEVELS = 5
const LEVEL_TIME_MS = 60000
const MAX_TIMEOUTS = 3
const WALL_DENSITY = 0.28

function gridSizeForLevel(level: number): number {
  return level + 4
}

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function key(c: Cell): string {
  return `${c.r},${c.c}`
}

function neighbors(c: Cell, size: number): Cell[] {
  const out: Cell[] = []
  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ]
  for (const d of dirs) {
    const nr = c.r + d.dr
    const nc = c.c + d.dc
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      out.push({ r: nr, c: nc })
    }
  }
  return out
}

function generateGrid(size: number): { grid: number[][]; optimal: number } {
  const start: Cell = { r: 0, c: 0 }
  const end: Cell = { r: size - 1, c: size - 1 }
  for (let attempt = 0; attempt < 60; attempt++) {
    const grid: number[][] = []
    for (let r = 0; r < size; r++) {
      const row: number[] = []
      for (let c = 0; c < size; c++) {
        if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) {
          row.push(0)
        } else {
          row.push(Math.random() < WALL_DENSITY ? 1 : 0)
        }
      }
      grid.push(row)
    }
    const dist = bfs(grid, start, end, size)
    if (dist > 0) return { grid, optimal: dist }
  }
  // fallback: open grid
  const grid: number[][] = []
  for (let r = 0; r < size; r++) {
    const row: number[] = []
    for (let c = 0; c < size; c++) row.push(0)
    grid.push(row)
  }
  const dist = bfs(grid, start, end, size)
  return { grid, optimal: dist > 0 ? dist : (size - 1) * 2 }
}

function bfs(
  grid: number[][],
  start: Cell,
  end: Cell,
  size: number
): number {
  const visited = new Set<string>([key(start)])
  const queue: { cell: Cell; dist: number }[] = [{ cell: start, dist: 0 }]
  while (queue.length > 0) {
    const item = queue.shift()
    if (item === undefined) break
    const { cell, dist } = item
    if (cell.r === end.r && cell.c === end.c) return dist
    for (const nb of neighbors(cell, size)) {
      const k = key(nb)
      if (visited.has(k)) continue
      const row = grid[nb.r]
      if (row === undefined) continue
      if (row[nb.c] === 1) continue
      visited.add(k)
      queue.push({ cell: nb, dist: dist + 1 })
    }
  }
  return -1
}

export interface PathFinderGameProps {
  locale: Locale
}

export function PathFinderGame({ locale }: PathFinderGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [level, setLevel] = useState(1)
  const [grid, setGrid] = useState<number[][]>([])
  const [path, setPath] = useState<Cell[]>([])
  const [optimal, setOptimal] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(LEVEL_TIME_MS)
  const [feedback, setFeedback] = useState<'none' | 'reached' | 'timeout'>(
    'none'
  )
  const [levelsCleared, setLevelsCleared] = useState(0)
  const [timeouts, setTimeouts] = useState(0)

  const levelStartRef = useRef(0)
  const timeoutsRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const size = gridSizeForLevel(level)

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setStatus('finished')
  }, [clearTimers])

  const advanceLevel = useCallback(
    (nextLevel: number, lastScore: number) => {
      setScore((s) => s + lastScore)
      if (nextLevel > TOTAL_LEVELS) {
        finishGame()
        return
      }
      const { grid: newGrid, optimal: newOptimal } = generateGrid(
        gridSizeForLevel(nextLevel)
      )
      setLevel(nextLevel)
      setGrid(newGrid)
      setOptimal(newOptimal)
      setPath([{ r: 0, c: 0 }])
      setFeedback('none')
      setTimeLeft(LEVEL_TIME_MS)
      levelStartRef.current = Date.now()

      clearTimers()
      intervalRef.current = setInterval(() => {
        const remaining = LEVEL_TIME_MS - (Date.now() - levelStartRef.current)
        if (remaining <= 0) {
          setTimeLeft(0)
          clearTimers()
          timeoutsRef.current += 1
          setTimeouts(timeoutsRef.current)
          setFeedback('timeout')
          // 0 score for this level; 3 timeouts end the game
          if (timeoutsRef.current >= MAX_TIMEOUTS) {
            advanceTimerRef.current = setTimeout(() => finishGame(), 1000)
          } else {
            advanceTimerRef.current = setTimeout(
              () => advanceLevel(nextLevel + 1, 0),
              1000
            )
          }
        } else {
          setTimeLeft(remaining)
        }
      }, 100)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setScore(0)
    setLevelsCleared(0)
    timeoutsRef.current = 0
    setTimeouts(0)
    setStatus('playing')
    advanceLevel(1, 0)
  }, [advanceLevel])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const handleCellClick = (cell: Cell) => {
    if (feedback !== 'none') return
    const row = grid[cell.r]
    if (row === undefined) return
    if (row[cell.c] === 1) return // wall

    // backtrack: clicking a cell already in path truncates to it
    const idx = path.findIndex((p) => p.r === cell.r && p.c === cell.c)
    if (idx >= 0) {
      setPath(path.slice(0, idx + 1))
      return
    }

    const last = path[path.length - 1]
    if (last === undefined) return
    const adjacent =
      Math.abs(last.r - cell.r) + Math.abs(last.c - cell.c) === 1
    if (!adjacent) return

    const nextPath = [...path, cell]
    setPath(nextPath)

    // reached goal?
    if (cell.r === size - 1 && cell.c === size - 1) {
      const steps = nextPath.length - 1
      const levelScore = Math.max(100, (optimal - steps + 10) * 50)
      setFeedback('reached')
      setLevelsCleared((c) => c + 1)
      clearTimers()
      advanceTimerRef.current = setTimeout(
        () => advanceLevel(level + 1, levelScore),
        900
      )
    }
  }

  const resetPath = () => {
    if (feedback !== 'none') return
    setPath([{ r: 0, c: 0 }])
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
          { label: t.timeouts, value: `${timeouts}/${MAX_TIMEOUTS}` },
          { label: t.level, value: level },
        ]}
      />
    )
  }

  const steps = Math.max(0, path.length - 1)
  const pathKeys = new Set(path.map(key))

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
            <span className="text-xs text-text-muted">{t.steps}</span>
            <span className="text-md font-bold text-dim-executive-text">
              {steps}
            </span>
            <span className="text-xs text-text-muted">
              / {t.optimal} {optimal}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.timeouts}</span>
            <span className="text-md font-bold text-error">
              {timeouts}/{MAX_TIMEOUTS}
            </span>
          </div>
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={LEVEL_TIME_MS}
          dimension="executive"
          showNumber
          roundLabel={`${t.level} ${level}/${TOTAL_LEVELS}`}
        />

        <div className="flex items-center justify-center min-h-[20px]">
          {feedback === 'reached' && (
            <span className="text-sm font-semibold text-dim-executive-text">
              {t.reached}
            </span>
          )}
          {feedback === 'timeout' && (
            <span className="text-sm font-semibold text-error">{t.timeout}</span>
          )}
        </div>

        <div
          className="mx-auto grid gap-px rounded-md bg-border p-px"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: 'min(100%, 420px)',
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isWall = cell === 1
              const inPath = pathKeys.has(key({ r, c }))
              const isStart = r === 0 && c === 0
              const isEnd = r === size - 1 && c === size - 1
              const isPathEnd =
                path.length > 0 &&
                path[path.length - 1] !== undefined &&
                path[path.length - 1]!.r === r &&
                path[path.length - 1]!.c === c
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick({ r, c })}
                  disabled={isWall || feedback !== 'none'}
                  aria-label={`${r},${c}`}
                  className={[
                    'aspect-square w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isWall
                      ? 'bg-text-primary/70'
                      : isPathEnd
                        ? 'bg-dim-executive'
                        : inPath
                          ? 'bg-dim-executive/60'
                          : isStart
                            ? 'bg-accent'
                            : isEnd
                              ? 'bg-primary'
                              : 'bg-background hover:bg-primary-bg',
                  ].join(' ')}
                />
              )
            })
          )}
        </div>

        <div className="flex items-center justify-center gap-md text-xs text-text-muted">
          <span className="flex items-center gap-xs">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent" />
            {t.start}
          </span>
          <span className="flex items-center gap-xs">
            <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
            {t.reached}
          </span>
        </div>

        <Button variant="ghost" size="md" onClick={resetPath} className="mx-auto">
          <Route className="mr-xs h-4 w-4" />
          {t.reset}
        </Button>
      </CardContent>
    </Card>
  )
}
