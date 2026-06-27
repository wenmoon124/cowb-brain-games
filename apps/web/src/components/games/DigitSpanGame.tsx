'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Brain, Play, RotateCcw, Delete } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'flashing' | 'input' | 'feedback'

type Locale = 'en' | 'zh' | 'ja'

interface Texts {
  title: string
  description: string
  start: string
  score: string
  length: string
  fails: string
  watch: string
  enter: string
  correct: string
  wrong: string
  gameover: string
  playAgain: string
  maxSpan: string
  correctRounds: string
  finalScore: string
  clear: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Digit Span',
    description:
      'Watch the digits flash, then enter them back. +1 length on success. 3 fails ends the game.',
    start: 'Start',
    score: 'Score',
    length: 'Length',
    fails: 'Fails',
    watch: 'Watch carefully',
    enter: 'Enter the sequence',
    correct: 'Correct!',
    wrong: 'Wrong!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    maxSpan: 'Max Span',
    correctRounds: 'Correct Rounds',
    finalScore: 'Final Score',
    clear: 'Clear',
  },
  zh: {
    title: '数字广度',
    description: '观察闪现的数字，然后输入。成功后长度+1，3次失败结束游戏。',
    start: '开始',
    score: '得分',
    length: '长度',
    fails: '失败',
    watch: '仔细观察',
    enter: '输入序列',
    correct: '正确！',
    wrong: '错误！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    maxSpan: '最长序列',
    correctRounds: '正确轮数',
    finalScore: '最终得分',
    clear: '清除',
  },
  ja: {
    title: '数字スパン',
    description: '点滅する数字を観察し、入力しよう。成功で長さ+1、3回失敗で終了。',
    start: '開始',
    score: 'スコア',
    length: '長さ',
    fails: '失敗',
    watch: 'よく見て',
    enter: 'シーケンスを入力',
    correct: '正解！',
    wrong: '不正解！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    maxSpan: '最長スパン',
    correctRounds: '正解ラウンド',
    finalScore: '最終スコア',
    clear: 'クリア',
  },
}

const MAX_FAILS = 3
const INITIAL_LENGTH = 3
const DIGIT_SHOW_MS = 1000
const DIGIT_GAP_MS = 200

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function generateSequence(length: number): number[] {
  const seq: number[] = []
  for (let i = 0; i < length; i++) {
    seq.push(Math.floor(Math.random() * 10))
  }
  return seq
}

export interface DigitSpanGameProps {
  locale: string
}

export function DigitSpanGame({ locale }: DigitSpanGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('flashing')
  const [sequence, setSequence] = useState<number[]>([])
  const [length, setLength] = useState(INITIAL_LENGTH)
  const [flashStep, setFlashStep] = useState(0)
  const [displayDigit, setDisplayDigit] = useState<number | null>(null)
  const [input, setInput] = useState<number[]>([])
  const [fails, setFails] = useState(0)
  const [maxSpan, setMaxSpan] = useState(0)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startRound = useCallback(
    (nextLength: number) => {
      const seq = generateSequence(nextLength)
      setSequence(seq)
      setLength(nextLength)
      setFlashStep(0)
      setInput([])
      setDisplayDigit(null)
      setFeedback('none')
      setPhase('flashing')
    },
    []
  )

  // Drive the flashing sequence
  useEffect(() => {
    if (status !== 'playing' || phase !== 'flashing') return
    const totalSteps = sequence.length * 2
    if (flashStep >= totalSteps) {
      setDisplayDigit(null)
      setPhase('input')
      return
    }
    const isShowStep = flashStep % 2 === 0
    if (isShowStep) {
      const digit = sequence[flashStep / 2]
      setDisplayDigit(digit ?? null)
      timerRef.current = setTimeout(() => {
        setFlashStep((s) => s + 1)
      }, DIGIT_SHOW_MS)
    } else {
      setDisplayDigit(null)
      timerRef.current = setTimeout(() => {
        setFlashStep((s) => s + 1)
      }, DIGIT_GAP_MS)
    }
    return () => clearTimer()
  }, [status, phase, flashStep, sequence, clearTimer])

  const finishGame = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimer()
    setStatus('finished')
  }, [clearTimer])

  const handleInput = (digit: number) => {
    if (phase !== 'input' || feedback !== 'none') return
    if (input.length >= sequence.length) return
    const next = [...input, digit]
    setInput(next)
    if (next.length === sequence.length) {
      const correct = next.every((d, i) => d === sequence[i])
      setFeedback(correct ? 'correct' : 'wrong')
      if (correct) {
        setCorrectRounds((c) => c + 1)
        setMaxSpan((m) => Math.max(m, length))
        timerRef.current = setTimeout(() => {
          startRound(length + 1)
        }, 800)
      } else {
        const newFails = fails + 1
        setFails(newFails)
        if (newFails >= MAX_FAILS) {
          timerRef.current = setTimeout(() => {
            finishGame()
          }, 800)
        } else {
          timerRef.current = setTimeout(() => {
            startRound(length)
          }, 800)
        }
      }
    }
  }

  const handleClear = () => {
    if (phase !== 'input' || feedback !== 'none') return
    setInput([])
  }

  const startGame = useCallback(() => {
    finishedRef.current = false
    setFails(0)
    setMaxSpan(0)
    setCorrectRounds(0)
    setLength(INITIAL_LENGTH)
    setStatus('playing')
    startRound(INITIAL_LENGTH)
  }, [startRound])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const finalScore = maxSpan * 200 + correctRounds * 50

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-memory/15">
            <Brain className="h-8 w-8 text-dim-memory" />
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
            <Brain className="h-8 w-8 text-dim-memory" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{t.gameover}</h2>
          <div className="grid grid-cols-3 gap-md w-full max-w-md">
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.finalScore}</div>
              <div className="text-xl font-bold text-primary">{finalScore}</div>
            </div>
            <div className="rounded-md bg-card p-md">
              <div className="text-xs text-text-muted">{t.maxSpan}</div>
              <div className="text-xl font-bold text-text-primary">
                {maxSpan}
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

  const failsPercent = (fails / MAX_FAILS) * 100

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.length}</span>
            <span className="text-md font-bold text-text-primary">
              {length}
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
          value={failsPercent}
          dimension="error"
          className="h-1.5"
        />

        <div className="flex flex-col items-center justify-center rounded-lg bg-background-secondary p-3xl min-h-[160px]">
          {phase === 'flashing' && (
            <>
              <span className="text-xs text-text-muted mb-md">{t.watch}</span>
              <div className="text-6xl font-bold text-dim-memory min-h-[64px] flex items-center">
                {displayDigit !== null ? displayDigit : ''}
              </div>
            </>
          )}
          {phase === 'input' && (
            <>
              <span className="text-xs text-text-muted mb-md">{t.enter}</span>
              <div className="flex items-center gap-xs min-h-[64px]">
                {sequence.map((_, i) => {
                  const entered = input[i]
                  return (
                    <div
                      key={i}
                      className={[
                        'flex h-12 w-10 items-center justify-center rounded-md border-2 text-2xl font-bold',
                        feedback === 'wrong' && entered !== undefined
                          ? entered === sequence[i]
                            ? 'border-success text-success'
                            : 'border-error text-error'
                          : 'border-border text-text-primary',
                      ].join(' ')}
                    >
                      {entered !== undefined ? entered : ''}
                    </div>
                  )
                })}
              </div>
              {feedback !== 'none' && (
                <span
                  className={[
                    'mt-sm text-sm font-semibold',
                    feedback === 'correct' ? 'text-success' : 'text-error',
                  ].join(' ')}
                >
                  {feedback === 'correct' ? t.correct : t.wrong}
                </span>
              )}
            </>
          )}
        </div>

        {phase === 'input' && (
          <div className="grid grid-cols-3 gap-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Button
                key={n}
                variant="secondary"
                size="lg"
                onClick={() => handleInput(n)}
                disabled={feedback !== 'none'}
                className="h-14 text-xl font-bold"
              >
                {n}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="lg"
              onClick={handleClear}
              disabled={feedback !== 'none'}
              className="h-14"
              aria-label={t.clear}
            >
              <Delete className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleInput(0)}
              disabled={feedback !== 'none'}
              className="h-14 text-xl font-bold"
            >
              0
            </Button>
            <div />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
