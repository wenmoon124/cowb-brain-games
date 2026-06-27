'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Eye } from 'lucide-react'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'

type GameStatus = 'idle' | 'playing' | 'finished'

type Phase = 'tracking' | 'selecting' | 'reveal'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  score: string
  round: string
  lives: string
  tracking: string
  selecting: string
  trackTargets: string
  tapTargets: string
  correct: string
  wrong: string
  hits: string
  errors: string
  avgReaction: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Eagle Eye',
    description:
      'Track the glowing targets as they move. When they stop, tap the ones you tracked.',
    start: 'Start',
    score: 'Score',
    round: 'Round',
    lives: 'Lives',
    tracking: 'Tracking',
    selecting: 'Tap the targets',
    trackTargets: 'Watch the glowing dots',
    tapTargets: 'Tap where the targets were',
    correct: 'Found!',
    wrong: 'Wrong!',
    hits: 'Hits',
    errors: 'Errors',
    avgReaction: 'Avg. Reaction',
  },
  zh: {
    title: '鹰眼',
    description: '追踪移动的发光目标。停止后，点击你追踪的目标。',
    start: '开始',
    score: '得分',
    round: '轮次',
    lives: '生命',
    tracking: '追踪中',
    selecting: '点击目标',
    trackTargets: '观察发光的点',
    tapTargets: '点击目标刚才的位置',
    correct: '找到！',
    wrong: '错误！',
    hits: '命中',
    errors: '错误',
    avgReaction: '平均反应',
  },
  ja: {
    title: 'イーグルアイ',
    description: '移動する発光目標を追跡し、停止後にタップしよう。',
    start: '開始',
    score: 'スコア',
    round: 'ラウンド',
    lives: 'ライフ',
    tracking: '追跡中',
    selecting: 'ターゲットをタップ',
    trackTargets: '光るドットを観察',
    tapTargets: 'ターゲットの位置をタップ',
    correct: '発見！',
    wrong: '不正解！',
    hits: '命中',
    errors: 'エラー',
    avgReaction: '平均反応',
  },
}

const TOTAL_ROUNDS = 10
const MAX_LIVES = 3
const TRACKING_MS = 3000
const SELECTING_MS = 5000
const REVEAL_MS = 1200
const MOVE_EVERY_MS = 700

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

/** Track 1 object (rounds 1-3), 2 (rounds 4-7), 3 (rounds 8-10) */
function trackedCountForRound(round: number): number {
  if (round <= 3) return 1
  if (round <= 7) return 2
  return 3
}

/** Distractors: 4 → 6 → 8 */
function distractorCountForRound(round: number): number {
  if (round <= 3) return 4
  if (round <= 7) return 6
  return 8
}

/** difficultyCoef = 1.0 + (trackedCount - 1) × 0.5 */
function difficultyCoefficient(trackedCount: number): number {
  return 1.0 + (trackedCount - 1) * 0.5
}

/** speedCoef = clamp(1.5 - rt/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

interface GameObject {
  id: number
  x: number // percent 0-100
  y: number // percent 0-100
  isTarget: boolean
  isFound: boolean
  isWrongTap: boolean
}

function randomPosition(): { x: number; y: number } {
  return {
    x: 12 + Math.random() * 76,
    y: 12 + Math.random() * 76,
  }
}

function buildObjects(round: number): GameObject[] {
  const tracked = trackedCountForRound(round)
  const distractors = distractorCountForRound(round)
  const total = tracked + distractors
  const objects: GameObject[] = []
  const positions: Array<{ x: number; y: number }> = []
  for (let i = 0; i < total; i++) {
    let pos = randomPosition()
    let attempts = 0
    while (
      attempts < 60 &&
      positions.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < 22)
    ) {
      pos = randomPosition()
      attempts++
    }
    positions.push(pos)
    objects.push({
      id: i,
      x: pos.x,
      y: pos.y,
      isTarget: i < tracked,
      isFound: false,
      isWrongTap: false,
    })
  }
  // Shuffle so target positions are randomized
  for (let i = objects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = objects[i]
    if (tmp) {
      objects[i] = objects[j] as GameObject
      objects[j] = tmp
    }
  }
  return objects
}

export interface EagleEyeGameProps {
  locale: string
}

export function EagleEyeGame({ locale }: EagleEyeGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>('tracking')
  const [objects, setObjects] = useState<GameObject[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [hits, setHits] = useState(0)
  const [errors, setErrors] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(TRACKING_MS)

  const objectsRef = useRef<GameObject[]>([])
  const selectingStartRef = useRef(0)
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishedRef = useRef(false)
  const livesRef = useRef(MAX_LIVES)
  const roundRef = useRef(1)

  const clearTimers = useCallback(() => {
    if (phaseTimeoutRef.current !== null) {
      clearTimeout(phaseTimeoutRef.current)
      phaseTimeoutRef.current = null
    }
    if (moveIntervalRef.current !== null) {
      clearInterval(moveIntervalRef.current)
      moveIntervalRef.current = null
    }
    if (tickIntervalRef.current !== null) {
      clearInterval(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimers()
    setObjects([])
    setStatus('finished')
  }, [clearTimers])

  // advancePhase is a single self-referential callback that handles all
  // phase transitions, avoiding circular useCallback dependencies.
  const advancePhaseRef = useRef<
    | ((currentPhase: Phase, currentRound: number, phaseStart: number) => void)
    | null
  >(null)

  const advancePhase = useCallback(
    (currentPhase: Phase, currentRound: number, phaseStart: number) => {
      if (finishedRef.current) return
      clearTimers()

      if (currentPhase === 'tracking') {
        // Transition tracking → selecting
        setPhase('selecting')
        selectingStartRef.current = Date.now()
        setTimeLeft(SELECTING_MS)

        tickIntervalRef.current = setInterval(() => {
          const remaining = SELECTING_MS - (Date.now() - selectingStartRef.current)
          setTimeLeft(remaining > 0 ? remaining : 0)
        }, 50)

        phaseTimeoutRef.current = setTimeout(() => {
          advancePhaseRef.current?.('selecting', currentRound, selectingStartRef.current)
        }, SELECTING_MS)
      } else if (currentPhase === 'selecting') {
        // Transition selecting → reveal
        setPhase('reveal')
        const allFound = objectsRef.current.every(
          (o) => !o.isTarget || o.isFound
        )
        const roundErrors = objectsRef.current.filter(
          (o) => o.isWrongTap
        ).length
        if (allFound && roundErrors === 0) {
          const tracked = trackedCountForRound(currentRound)
          const rt = Date.now() - phaseStart
          setReactionTimes((prev) => [...prev, rt])
          // roundScore = 200 × trackedCount × speedCoef × difficultyCoef
          const roundScore = Math.round(
            200 *
              tracked *
              speedCoefficient(rt, SELECTING_MS) *
              difficultyCoefficient(tracked)
          )
          setScore((s) => s + roundScore)
          setHits((h) => h + tracked)
        }

        phaseTimeoutRef.current = setTimeout(() => {
          const next = currentRound + 1
          if (next > TOTAL_ROUNDS || livesRef.current <= 0) {
            finishGame()
            return
          }
          advancePhaseRef.current?.('reveal', next, Date.now())
        }, REVEAL_MS)
      } else if (currentPhase === 'reveal') {
        // Transition reveal → tracking (new round)
        if (currentRound > TOTAL_ROUNDS || livesRef.current <= 0) {
          finishGame()
          return
        }
        roundRef.current = currentRound
        const newObjects = buildObjects(currentRound)
        objectsRef.current = newObjects
        setObjects(newObjects)
        setRound(currentRound)
        setPhase('tracking')
        setTimeLeft(TRACKING_MS)
        const trackingStart = Date.now()

        tickIntervalRef.current = setInterval(() => {
          const remaining = TRACKING_MS - (Date.now() - trackingStart)
          setTimeLeft(remaining > 0 ? remaining : 0)
        }, 50)

        moveIntervalRef.current = setInterval(() => {
          setObjects((prev) =>
            prev.map((obj) => {
              const dx = (Math.random() - 0.5) * 18
              const dy = (Math.random() - 0.5) * 18
              return {
                ...obj,
                x: Math.max(8, Math.min(92, obj.x + dx)),
                y: Math.max(8, Math.min(92, obj.y + dy)),
              }
            })
          )
        }, MOVE_EVERY_MS)

        phaseTimeoutRef.current = setTimeout(() => {
          advancePhaseRef.current?.('tracking', currentRound, trackingStart)
        }, TRACKING_MS)
      }
    },
    [clearTimers, finishGame]
  )

  useEffect(() => {
    advancePhaseRef.current = advancePhase
  }, [advancePhase])

  const startGame = useCallback(() => {
    finishedRef.current = false
    livesRef.current = MAX_LIVES
    setScore(0)
    setLives(MAX_LIVES)
    setHits(0)
    setErrors(0)
    setReactionTimes([])
    setRound(1)
    setStatus('playing')
    // Kick off round 1 in tracking phase
    advancePhaseRef.current?.('reveal', 1, Date.now())
  }, [])

  const handleObjectClick = (id: number) => {
    if (phase !== 'selecting') return
    const obj = objectsRef.current.find((o) => o.id === id)
    if (!obj) return
    if (obj.isFound || obj.isWrongTap) return

    if (obj.isTarget) {
      const updated = objectsRef.current.map((o) =>
        o.id === id ? { ...o, isFound: true } : o
      )
      objectsRef.current = updated
      setObjects(updated)
      // If all targets found → end selecting early
      const allFound = updated.every((o) => !o.isTarget || o.isFound)
      if (allFound) {
        if (phaseTimeoutRef.current !== null) {
          clearTimeout(phaseTimeoutRef.current)
          phaseTimeoutRef.current = null
        }
        if (tickIntervalRef.current !== null) {
          clearInterval(tickIntervalRef.current)
          tickIntervalRef.current = null
        }
        phaseTimeoutRef.current = setTimeout(() => {
          advancePhaseRef.current?.(
            'selecting',
            roundRef.current,
            selectingStartRef.current
          )
        }, 400)
      }
    } else {
      const updated = objectsRef.current.map((o) =>
        o.id === id ? { ...o, isWrongTap: true } : o
      )
      objectsRef.current = updated
      setObjects(updated)
      setErrors((e) => e + 1)
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
      if (livesRef.current <= 0) {
        clearTimers()
        phaseTimeoutRef.current = setTimeout(() => finishGame(), 600)
      }
    }
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
  // finalScore = max(0, Σ roundScores - errors × 100)
  const finalScore = Math.max(0, score - errors * 100)
  const totalAttempts = hits + errors
  const accuracy =
    totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-attention/15">
            <Eye className="h-8 w-8 text-dim-attention" />
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
          { label: t.errors, value: errors },
        ]}
      />
    )
  }

  const timerTotal = phase === 'tracking' ? TRACKING_MS : SELECTING_MS

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
            <span className="text-md font-bold text-primary">{finalScore}</span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.lives}</span>
            <span className="text-md font-bold text-error">{lives}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-dim-attention-text">
            {phase === 'tracking' ? t.trackTargets : t.tapTargets}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {phase === 'tracking'
              ? t.tracking
              : phase === 'selecting'
                ? t.selecting
                : ''}
          </span>
        </div>

        {phase !== 'reveal' && (
          <GameTimer
            timeLeft={timeLeft}
            totalTime={timerTotal}
            dimension="attention"
            showNumber
            roundLabel={`${t.round} ${round}/${TOTAL_ROUNDS}`}
          />
        )}

        <div
          className="relative w-full overflow-hidden rounded-lg bg-background-secondary"
          style={{ height: 340 }}
        >
          {objects.map((obj) => {
            const showTargetGlow = phase === 'tracking' && obj.isTarget
            const showFound = obj.isFound
            const showMissed =
              phase === 'reveal' && obj.isTarget && !obj.isFound
            const showWrong = obj.isWrongTap
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => handleObjectClick(obj.id)}
                disabled={phase !== 'selecting'}
                aria-label={`object-${obj.id}`}
                className={[
                  'absolute flex h-8 w-8 items-center justify-center rounded-full transition-all duration-700 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  showTargetGlow
                    ? 'bg-dim-attention shadow-glow-attention'
                    : 'bg-card border-2 border-border',
                  showFound ? '!bg-success shadow-sm' : '',
                  showMissed ? '!bg-error shadow-sm' : '',
                  showWrong ? '!bg-error/60 ring-2 ring-error' : '',
                  phase === 'selecting' && !showFound && !showWrong
                    ? 'cursor-pointer hover:scale-110 hover:shadow-md'
                    : 'cursor-default',
                ].join(' ')}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {showFound && (
                  <span className="text-xs font-bold text-white">✓</span>
                )}
                {showMissed && (
                  <span className="text-xs font-bold text-white">✗</span>
                )}
                {showWrong && (
                  <span className="text-xs font-bold text-white">✗</span>
                )}
              </button>
            )
          })}
          {phase === 'reveal' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background-secondary/50">
              <span className="rounded-md bg-card px-md py-sm text-sm font-semibold text-text-primary shadow-md">
                {objects.every((o) => !o.isTarget || o.isFound) &&
                objects.every((o) => !o.isWrongTap)
                  ? t.correct
                  : t.wrong}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
