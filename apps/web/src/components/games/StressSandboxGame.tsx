'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GameResult } from '@/components/games/GameResult'
import { GameRules } from '@/components/games/GameRules'
import { Play, Square, Palette, Circle, Hourglass } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Mode = 'bubbles' | 'draw' | 'hourglass'
type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  modeBubbles: string
  modeDraw: string
  modeHourglass: string
  endSession: string
  rules: string[]
  scoring: string[]
  tips: string[]
  interactions: string
  timeLeft: string
  flip: string
  clear: string
  popHint: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Stress Sandbox',
    description:
      'Pop bubbles, doodle, or just watch the sand fall. A pressure-free 3-minute break.',
    dimensionLabel: 'Relaxation',
    start: 'Start',
    modeBubbles: 'Bubble Wrap',
    modeDraw: 'Free Draw',
    modeHourglass: 'Sandglass',
    endSession: 'End session',
    rules: [
      'Switch between three calming modes anytime.',
      'Bubble Wrap: tap bubbles to pop them.',
      'Free Draw: drag to doodle in warm colors.',
      'Sandglass: watch the sand, flip it whenever you like.',
    ],
    scoring: [
      'Score = interactions × 10 + completion × 500.',
      'Completion = 1.0 if the session runs to the end, 0.5 if you leave early.',
      'There is no losing — just relax.',
    ],
    tips: [
      'No goals here — go as slow as you like.',
      'Try all three modes to find what calms you.',
    ],
    interactions: 'Interactions',
    timeLeft: 'Time left',
    flip: 'Flip',
    clear: 'Clear',
    popHint: 'Tap the bubbles',
  },
  zh: {
    title: '压力沙盒',
    description: '捏气泡、涂鸦，或观看沙漏。3 分钟无压力小憩。',
    dimensionLabel: '放松',
    start: '开始',
    modeBubbles: '气泡纸',
    modeDraw: '自由绘画',
    modeHourglass: '沙漏',
    endSession: '结束会话',
    rules: [
      '随时在三种模式间切换。',
      '气泡纸：点击气泡使其破裂。',
      '自由绘画：拖拽以暖色涂鸦。',
      '沙漏：观看沙粒，随时翻转。',
    ],
    scoring: [
      '得分 = 互动次数 × 10 + 完成系数 × 500。',
      '完成系数：到时结束为 1.0，中途退出为 0.5。',
      '没有失败——只管放松。',
    ],
    tips: ['没有目标——慢慢来。', '三种模式都试试，找到最让你平静的。'],
    interactions: '互动次数',
    timeLeft: '剩余时间',
    flip: '翻转',
    clear: '清除',
    popHint: '点击气泡',
  },
  ja: {
    title: 'ストレスサンドボックス',
    description: '泡泡を弾く、落書き、砂時計を見る。3分間のプレッシャーフリーブレイク。',
    dimensionLabel: 'リラクゼーション',
    start: '開始',
    modeBubbles: '泡泡',
    modeDraw: 'フリードロー',
    modeHourglass: '砂時計',
    endSession: 'セッション終了',
    rules: [
      '3つのモードをいつでも切替可。',
      '泡泡：タップで弾ける。',
      'フリードロー：ドラッグで暖色落書き。',
      '砂時計：砂を見る、好きに反転。',
    ],
    scoring: [
      'スコア = インタラクション × 10 + 完了係数 × 500。',
      '完了係数：最後まで1.0、途中退出0.5。',
      '失敗なし—リラックスのみ。',
    ],
    tips: ['目標なし—ゆっくり。', '3モード全て試して。'],
    interactions: 'インタラクション',
    timeLeft: '残り時間',
    flip: '反転',
    clear: 'クリア',
    popHint: '泡泡をタップ',
  },
}

const SESSION_MS = 3 * 60 * 1000
const BUBBLE_ROWS = 6
const BUBBLE_COLS = 6
const BUBBLE_TOTAL = BUBBLE_ROWS * BUBBLE_COLS
const DRAW_COLORS = ['#FF6B35', '#FFB14A', '#FFD700', '#F472B6', '#FB7185', '#EC4899']

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

export interface StressSandboxGameProps {
  locale: string
}

export function StressSandboxGame({ locale }: StressSandboxGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [mode, setMode] = useState<Mode>('bubbles')
  const [interactions, setInteractions] = useState(0)
  const [timeLeft, setTimeLeft] = useState(SESSION_MS)
  const [bubbles, setBubbles] = useState<boolean[]>(() =>
    Array.from({ length: BUBBLE_TOTAL }, () => false)
  )
  const [flipCount, setFlipCount] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const strokeColorRef = useRef(DRAW_COLORS[0] ?? '#FF6B35')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(0)
  const interactionsRef = useRef(0)
  const finishedRef = useRef(false)
  const endedNaturallyRef = useRef(false)

  const bumpInteraction = useCallback(() => {
    interactionsRef.current += 1
    setInteractions(interactionsRef.current)
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const finishGame = useCallback(
    (naturally: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      endedNaturallyRef.current = naturally
      clearTimer()
      setStatus('finished')
    },
    [clearTimer]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    endedNaturallyRef.current = false
    interactionsRef.current = 0
    setInteractions(0)
    setMode('bubbles')
    setBubbles(Array.from({ length: BUBBLE_TOTAL }, () => false))
    setFlipCount(0)
    setTimeLeft(SESSION_MS)
    startRef.current = Date.now()
    setStatus('playing')
    intervalRef.current = setInterval(() => {
      const remaining = SESSION_MS - (Date.now() - startRef.current)
      if (remaining <= 0) {
        setTimeLeft(0)
        finishGame(true)
      } else {
        setTimeLeft(remaining)
      }
    }, 250)
  }, [finishGame])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  // ---- Bubble mode ----
  const handleBubbleClick = (idx: number) => {
    setBubbles((prev) => {
      if (prev[idx] === true) return prev
      const next = prev.slice()
      next[idx] = true
      return next
    })
    bumpInteraction()
  }

  useEffect(() => {
    if (mode !== 'bubbles' || status !== 'playing') return
    if (bubbles.every((b) => b)) {
      // all popped — refill after a beat
      const id = setTimeout(() => {
        setBubbles(Array.from({ length: BUBBLE_TOTAL }, () => false))
      }, 400)
      return () => clearTimeout(id)
    }
  }, [bubbles, mode, status])

  // ---- Draw mode ----
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas === null) return null
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const ensureCanvasSize = () => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const targetW = Math.floor(rect.width * dpr)
    const targetH = Math.floor(rect.height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }
  }

  const handleDrawStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    ensureCanvasSize()
    const p = getCanvasPoint(e)
    if (p === null) return
    drawingRef.current = true
    lastPointRef.current = p
    strokeColorRef.current =
      DRAW_COLORS[interactionsRef.current % DRAW_COLORS.length] ?? '#FF6B35'
    bumpInteraction()
    ;(e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId)
  }

  const handleDrawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const last = lastPointRef.current
    if (canvas === null || last === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return
    const p = getCanvasPoint(e)
    if (p === null) return
    const dpr = window.devicePixelRatio || 1
    ctx.strokeStyle = strokeColorRef.current
    ctx.lineWidth = 4 * dpr
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.x * dpr, last.y * dpr)
    ctx.lineTo(p.x * dpr, p.y * dpr)
    ctx.stroke()
    lastPointRef.current = p
  }

  const handleDrawEnd = () => {
    drawingRef.current = false
    lastPointRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // ---- Hourglass mode ----
  const handleFlip = () => {
    setFlipCount((c) => c + 1)
    bumpInteraction()
  }

  if (status === 'idle') {
    return (
      <GameRules
        title={t.title}
        dimension="relaxation"
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
    const completionFactor = endedNaturallyRef.current ? 1.0 : 0.5
    const finalScore = Math.round(interactions * 10 + completionFactor * 500)
    return (
      <GameResult
        score={finalScore}
        dimension="relaxation"
        onRetry={() => setStatus('idle')}
        stats={[
          { label: t.interactions, value: interactions },
          {
            label: t.timeLeft,
            value: `${Math.ceil(timeLeft / 1000)}s`,
          },
          {
            label: t.endSession,
            value: endedNaturallyRef.current ? '100%' : '50%',
          },
        ]}
      />
    )
  }

  const progressPercent = ((SESSION_MS - timeLeft) / SESSION_MS) * 100
  const secondsLeft = Math.ceil(timeLeft / 1000)

  const modeButtons: { key: Mode; label: string; icon: typeof Circle }[] = [
    { key: 'bubbles', label: t.modeBubbles, icon: Circle },
    { key: 'draw', label: t.modeDraw, icon: Palette },
    { key: 'hourglass', label: t.modeHourglass, icon: Hourglass },
  ]

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {t.timeLeft}: {secondsLeft}s
          </span>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.interactions}</span>
            <span className="text-md font-bold text-dim-relaxation-text">
              {interactions}
            </span>
          </div>
        </div>

        <Progress value={progressPercent} dimension="relaxation" className="h-1.5" />

        <div className="grid grid-cols-3 gap-sm">
          {modeButtons.map((m) => {
            const Icon = m.icon
            const active = mode === m.key
            return (
              <Button
                key={m.key}
                variant={active ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setMode(m.key)}
              >
                <Icon className="mr-xs h-4 w-4" />
                {m.label}
              </Button>
            )
          })}
        </div>

        {/* Bubbles */}
        {mode === 'bubbles' && (
          <div className="flex flex-col items-center gap-sm">
            <span className="text-xs text-text-muted">{t.popHint}</span>
            <div
              className="grid gap-sm"
              style={{
                gridTemplateColumns: `repeat(${BUBBLE_COLS}, minmax(0, 1fr))`,
              }}
            >
              {bubbles.map((popped, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBubbleClick(idx)}
                  aria-label={`${t.modeBubbles} ${idx + 1}`}
                  className={[
                    'h-11 w-11 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    popped
                      ? 'scale-125 opacity-0'
                      : 'bg-dim-relaxation/70 shadow-glow-relaxation hover:scale-105 active:scale-95',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Draw */}
        {mode === 'draw' && (
          <div className="flex flex-col items-center gap-sm">
            <canvas
              ref={canvasRef}
              onPointerDown={handleDrawStart}
              onPointerMove={handleDrawMove}
              onPointerUp={handleDrawEnd}
              onPointerLeave={handleDrawEnd}
              className="h-64 w-full touch-none rounded-lg bg-background-secondary"
              aria-label={t.modeDraw}
            />
            <Button variant="ghost" size="sm" onClick={clearCanvas}>
              {t.clear}
            </Button>
          </div>
        )}

        {/* Hourglass */}
        {mode === 'hourglass' && (
          <div className="flex flex-col items-center gap-md">
            <svg
              width="140"
              height="180"
              viewBox="0 0 140 180"
              aria-label={t.modeHourglass}
            >
              <defs>
                <clipPath id="hg-clip">
                  <polygon points="20,10 120,10 70,90" />
                  <polygon points="70,90 120,170 20,170" />
                </clipPath>
              </defs>
              {/* glass outline */}
              <polygon
                points="20,10 120,10 70,90"
                fill="none"
                stroke="#7A6458"
                strokeWidth="3"
              />
              <polygon
                points="70,90 120,170 20,170"
                fill="none"
                stroke="#7A6458"
                strokeWidth="3"
              />
              {/* sand (driven by session progress) */}
              <g clipPath="url(#hg-clip)">
                {(() => {
                  const frac = Math.min(
                    1,
                    Math.max(0, (SESSION_MS - timeLeft) / SESSION_MS)
                  )
                  const topH = (1 - frac) * 80
                  const bottomH = frac * 80
                  return (
                    <>
                      <rect x="20" y={10 + (80 - topH)} width="100" height={topH} fill="#FFB14A" />
                      <rect x="20" y={90} width="100" height={bottomH} fill="#FFB14A" />
                    </>
                  )
                })()}
              </g>
              <rect x="66" y="86" width="8" height="8" fill="#FFB14A" />
            </svg>
            <Button variant="secondary" size="md" onClick={handleFlip}>
              <Hourglass className="mr-xs h-4 w-4" />
              {t.flip} ({flipCount})
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="md"
          onClick={() => finishGame(false)}
          className="mx-auto"
        >
          <Square className="mr-xs h-4 w-4" />
          {t.endSession}
        </Button>
      </CardContent>
    </Card>
  )
}
