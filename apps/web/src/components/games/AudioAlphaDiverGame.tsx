'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameRules } from '@/components/games/GameRules'
import { Waves, Play, Square } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  duration: string
  startRelaxation: string
  endRelaxation: string
  submit: string
  inhale: string
  hold: string
  exhale: string
  pause: string
  endSession: string
  completed: string
  rules: string[]
  scoring: string[]
  tips: string[]
  minutes: (n: number) => string
  finalScore: string
  sessionTime: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Audio Alpha Diver',
    description:
      'Drift into a generated ambient soundscape and follow the breathing circle. No way to lose.',
    dimensionLabel: 'Relaxation',
    start: 'Begin',
    duration: 'Duration',
    startRelaxation: 'Relaxation now',
    endRelaxation: 'How relaxed do you feel?',
    submit: 'Finish',
    inhale: 'Breathe in',
    hold: 'Hold',
    exhale: 'Breathe out',
    pause: 'Rest',
    endSession: 'End session',
    completed: 'Session Complete',
    rules: [
      'Pick a session length and rate how relaxed you feel right now.',
      'A soft ambient sound plays — close your eyes if you like.',
      'Follow the breathing circle: in, hold, out, rest.',
      'When time is up, rate your relaxation again.',
    ],
    scoring: [
      'Score = completion × 800 × duration factor + relaxation × 200.',
      'Duration factor: 3 min ×1.0, 5 min ×1.3, 10 min ×1.8.',
      'There is no failing — only finishing.',
    ],
    tips: [
      'Use headphones for the best ambient effect.',
      'Let your shoulders drop with every exhale.',
    ],
    minutes: (n) => `${n} min`,
    finalScore: 'Final Score',
    sessionTime: 'Session Time',
  },
  zh: {
    title: '声波深潜',
    description: '沉浸于生成的环境音景，跟随呼吸圆环。无法失败。',
    dimensionLabel: '放松',
    start: '开始',
    duration: '时长',
    startRelaxation: '当前放松度',
    endRelaxation: '你现在感觉多放松？',
    submit: '完成',
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    pause: '休息',
    endSession: '结束会话',
    completed: '会话完成',
    rules: [
      '选择时长并评估当前放松度。',
      '播放柔和环境音——可闭上眼睛。',
      '跟随呼吸圆环：吸、屏、呼、歇。',
      '时间到后再次评估放松度。',
    ],
    scoring: [
      '得分 = 完成率 × 800 × 时长系数 + 放松度 × 200。',
      '时长系数：3 分钟 ×1.0，5 分钟 ×1.3，10 分钟 ×1.8。',
      '没有失败——只有完成。',
    ],
    tips: ['戴上耳机效果更佳。', '每次呼气时让肩膀下沉。'],
    minutes: (n) => `${n} 分钟`,
    finalScore: '最终得分',
    sessionTime: '会话时长',
  },
  ja: {
    title: 'オーディオアルファダイバー',
    description: '生成された環境音に漂い、呼吸円に従う。失敗はありません。',
    dimensionLabel: 'リラクゼーション',
    start: '開始',
    duration: '時間',
    startRelaxation: '今のリラックス度',
    endRelaxation: 'どれくらいリラックスしましたか？',
    submit: '完了',
    inhale: '吸う',
    hold: '止める',
    exhale: '吐く',
    pause: '休む',
    endSession: 'セッション終了',
    completed: 'セッション完了',
    rules: [
      '時間を選び、今のリラックス度を評価。',
      '柔らかな環境音が流れます—目を閉じてもOK。',
      '呼吸円に従う：吸う・止める・吐く・休む。',
      '時間が来たら再度リラックス度を評価。',
    ],
    scoring: [
      'スコア = 完了率 × 800 × 時間係数 + リラックス度 × 200。',
      '時間係数：3分×1.0、5分×1.3、10分×1.8。',
      '失敗はありません—完了のみ。',
    ],
    tips: ['イヤホン推奨。', '吐く息で肩を下げる。'],
    minutes: (n) => `${n} 分`,
    finalScore: '最終スコア',
    sessionTime: 'セッション時間',
  },
}

const DURATIONS = [3, 5, 10] as const
const DURATION_COEFF: Record<number, number> = { 3: 1.0, 5: 1.3, 10: 1.8 }
const CYCLE_INHALE_MS = 4000
const CYCLE_HOLD_MS = 2000
const CYCLE_EXHALE_MS = 6000
const CYCLE_PAUSE_MS = 2000
const CYCLE_MS =
  CYCLE_INHALE_MS + CYCLE_HOLD_MS + CYCLE_EXHALE_MS + CYCLE_PAUSE_MS

interface AudioNodes {
  ctx: AudioContext
  source: AudioBufferSourceNode
  gain: GainNode
}

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause'

function getPhase(cyclePos: number): { scale: number; key: BreathPhase } {
  if (cyclePos < CYCLE_INHALE_MS) {
    const p = cyclePos / CYCLE_INHALE_MS
    return { scale: 1 + p * 0.4, key: 'inhale' }
  }
  if (cyclePos < CYCLE_INHALE_MS + CYCLE_HOLD_MS) {
    return { scale: 1.4, key: 'hold' }
  }
  if (cyclePos < CYCLE_INHALE_MS + CYCLE_HOLD_MS + CYCLE_EXHALE_MS) {
    const p =
      (cyclePos - CYCLE_INHALE_MS - CYCLE_HOLD_MS) / CYCLE_EXHALE_MS
    return { scale: 1.4 - p * 0.4, key: 'exhale' }
  }
  return { scale: 1, key: 'pause' }
}

function createAmbient(): AudioNodes | null {
  const w = window as unknown as {
    AudioContext: typeof AudioContext
    webkitAudioContext?: typeof AudioContext
  }
  const Ctor = w.AudioContext ?? w.webkitAudioContext
  if (!Ctor) return null
  const ctx = new Ctor()
  const bufferSize = 2 * ctx.sampleRate
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  // brown noise
  let last = 0
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 520
  const gain = ctx.createGain()
  gain.gain.value = 0.0
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()
  // gentle fade in
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2)
  return { ctx, source, gain }
}

export interface AudioAlphaDiverGameProps {
  locale: Locale
}

export function AudioAlphaDiverGame({ locale }: AudioAlphaDiverGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [durationMin, setDurationMin] = useState<number>(DURATIONS[1] ?? 5)
  const [startRating, setStartRating] = useState(5)
  const [endRating, setEndRating] = useState(5)
  const [endRated, setEndRated] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [completion, setCompletion] = useState(0)

  const audioRef = useRef<AudioNodes | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(0)
  const targetMsRef = useRef(0)
  const finishedRef = useRef(false)

  const stopAudio = useCallback(() => {
    const nodes = audioRef.current
    if (nodes !== null) {
      try {
        nodes.gain.gain.linearRampToValueAtTime(
          0,
          nodes.ctx.currentTime + 0.4
        )
        nodes.source.stop(nodes.ctx.currentTime + 0.5)
        nodes.ctx.close()
      } catch {
        // ignore
      }
      audioRef.current = null
    }
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const endSession = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimer()
    stopAudio()
    const target = targetMsRef.current
    const elapsed = Math.min(target, Date.now() - startRef.current)
    setElapsedMs(elapsed)
    setCompletion(target > 0 ? elapsed / target : 0)
    setEndRated(false)
    setStatus('finished')
  }, [clearTimer, stopAudio])

  const startGame = useCallback(() => {
    finishedRef.current = false
    const nodes = createAmbient()
    audioRef.current = nodes
    if (nodes !== null) {
      void nodes.ctx.resume().catch(() => {})
    }
    const target = durationMin * 60 * 1000
    targetMsRef.current = target
    startRef.current = Date.now()
    setElapsedMs(0)
    setCompletion(0)
    setStatus('playing')
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setElapsedMs(elapsed)
      if (elapsed >= targetMsRef.current) {
        endSession()
      }
    }, 100)
  }, [durationMin, endSession])

  const submitEndRating = () => {
    setEndRated(true)
  }

  const reset = useCallback(() => {
    setStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      clearTimer()
      stopAudio()
    }
  }, [clearTimer, stopAudio])

  const targetMs = durationMin * 60 * 1000
  const progressPercent = Math.min(100, (elapsedMs / targetMs) * 100)
  const cyclePos = elapsedMs % CYCLE_MS
  const { scale, key: phaseKey } = getPhase(cyclePos)
  const phaseText =
    phaseKey === 'inhale'
      ? t.inhale
      : phaseKey === 'hold'
        ? t.hold
        : phaseKey === 'exhale'
          ? t.exhale
          : t.pause

  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  const remainingSeconds = Math.max(
    0,
    Math.ceil((targetMsRef.current - elapsedMs) / 1000)
  )
  const durationCoeff = DURATION_COEFF[durationMin] ?? 1.0
  const finalScore = Math.round(
    completion * 800 * durationCoeff + (endRating / 10) * 200
  )

  if (status === 'idle') {
    return (
      <GameRules
        t={tt}
        title={t.title}
        dimension="relaxation"
        dimensionLabel={t.dimensionLabel}
        rules={t.rules}
        scoring={t.scoring}
        tips={t.tips}
      >
        <div className="flex w-full flex-col items-center gap-lg">
          <div className="flex flex-col items-center gap-sm">
            <span className="text-xs text-text-muted">{t.duration}</span>
            <div className="flex gap-sm">
              {DURATIONS.map((d) => (
                <Button
                  key={d}
                  variant={durationMin === d ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setDurationMin(d)}
                >
                  {t.minutes(d)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex w-full max-w-xs flex-col items-center gap-xs">
            <div className="flex w-full items-center justify-between text-xs text-text-muted">
              <span>{t.startRelaxation}</span>
              <span className="font-bold text-dim-relaxation-text">
                {startRating}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={startRating}
              onChange={(e) => setStartRating(Number(e.target.value))}
              aria-label={t.startRelaxation}
              className="w-full accent-[#FB7185]"
            />
          </div>
          <Button variant="primary" size="lg" onClick={startGame}>
            <Play className="mr-xs h-5 w-5" />
            {t.start}
          </Button>
        </div>
      </GameRules>
    )
  }

  if (status === 'finished' && !endRated) {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-relaxation/15">
            <Waves className="h-8 w-8 text-dim-relaxation" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            {t.completed}
          </h2>
          <div className="flex w-full max-w-xs flex-col items-center gap-xs">
            <div className="flex w-full items-center justify-between text-xs text-text-muted">
              <span>{t.endRelaxation}</span>
              <span className="font-bold text-dim-relaxation-text">
                {endRating}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={endRating}
              onChange={(e) => setEndRating(Number(e.target.value))}
              aria-label={t.endRelaxation}
              className="w-full accent-[#FB7185]"
            />
          </div>
          <Button variant="primary" size="lg" onClick={submitEndRating}>
            {t.submit}
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
        dimension="relaxation"
        onRetry={reset}
        stats={[
          { label: t.sessionTime, value: `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}` },
          { label: t.startRelaxation, value: `${startRating}/10` },
          { label: t.endRelaxation, value: `${endRating}/10` },
        ]}
      />
    )
  }

  // playing
  const hue = (340 + (elapsedMs / 1000) * 4) % 360
  const bgGradient = `linear-gradient(135deg, hsl(${hue}, 70%, 88%), hsl(${(hue + 40) % 360}, 70%, 82%))`

  return (
    <Card
      className="border-primary-light overflow-hidden"
      style={{ background: bgGradient, transition: 'background 1s linear' }}
    >
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs font-medium text-text-secondary">
            {Math.floor(elapsedSeconds / 60)}:
            {String(elapsedSeconds % 60).padStart(2, '0')}
          </span>
          <span className="text-xs font-medium text-text-secondary">
            {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <Progress
          value={progressPercent}
          dimension="relaxation"
          className="h-1.5"
        />

        <div className="flex flex-col items-center justify-center gap-md py-3xl min-h-[320px]">
          <div className="relative flex h-52 w-52 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-dim-relaxation/20 blur-lg"
              style={{ transform: `scale(${scale})` }}
              aria-hidden="true"
            />
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-dim-relaxation to-secondary text-white shadow-glow-relaxation"
              style={{
                transform: `scale(${scale})`,
                transitionDuration: '200ms',
              }}
              aria-live="polite"
            >
              <span className="text-lg font-semibold">{phaseText}</span>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="md" onClick={endSession} className="mx-auto">
          <Square className="mr-xs h-4 w-4" />
          {t.endSession}
        </Button>
      </CardContent>
    </Card>
  )
}
