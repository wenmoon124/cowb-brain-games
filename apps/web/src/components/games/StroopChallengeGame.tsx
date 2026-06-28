'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shuffle, Play, Heart } from 'lucide-react'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

type GameStatus = 'idle' | 'playing' | 'finished'
type Phase = 'showing' | 'feedback'

type ColorKey = 'red' | 'orange' | 'yellow' | 'pink' | 'coral'

interface ColorDef {
  hex: string
  label: string
}

interface Texts {
  title: string
  description: string
  start: string
  question: string
  lives: string
  score: string
  correct: string
  wrong: string
  timeout: string
  gameover: string
  playAgain: string
  accuracy: string
}

const COLOR_MAP: Record<Locale, Record<ColorKey, ColorDef>> = {
  en: {
    red: { hex: '#EF4444', label: 'Red' },
    orange: { hex: '#FF6B35', label: 'Orange' },
    yellow: { hex: '#FFD700', label: 'Yellow' },
    pink: { hex: '#EC4899', label: 'Pink' },
    coral: { hex: '#FB7185', label: 'Coral' },
  },
  zh: {
    red: { hex: '#EF4444', label: '红色' },
    orange: { hex: '#FF6B35', label: '橙色' },
    yellow: { hex: '#FFD700', label: '黄色' },
    pink: { hex: '#EC4899', label: '粉色' },
    coral: { hex: '#FB7185', label: '珊瑚' },
  },
  ja: {
    red: { hex: '#EF4444', label: '赤' },
    orange: { hex: '#FF6B35', label: 'オレンジ' },
    yellow: { hex: '#FFD700', label: '黄' },
    pink: { hex: '#EC4899', label: 'ピンク' },
    coral: { hex: '#FB7185', label: 'コーラル' },
  },
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Stroop Challenge',
    description:
      'Pick the TEXT COLOR of the word, not its meaning. 30 questions, 3s each. 3 lives.',
    start: 'Start',
    question: 'Tap the text color',
    lives: 'Lives',
    score: 'Score',
    correct: 'Correct!',
    wrong: 'Wrong!',
    timeout: 'Timeout!',
    gameover: 'Game Over',
    playAgain: 'Play Again',
    accuracy: 'Accuracy',
  },
  zh: {
    title: 'Stroop 挑战',
    description: '选择文字的颜色（而不是文字含义）。共 30 题，每题 3 秒，3 条命。',
    start: '开始',
    question: '点击文字颜色',
    lives: '生命',
    score: '得分',
    correct: '正确！',
    wrong: '错误！',
    timeout: '超时！',
    gameover: '游戏结束',
    playAgain: '再来一局',
    accuracy: '准确率',
  },
  ja: {
    title: 'ストループチャレンジ',
    description: '文字の意味ではなく、テキストの色を選ぼう。全30問、各3秒、ライフ3。',
    start: '開始',
    question: 'テキストの色をタップ',
    lives: 'ライフ',
    score: 'スコア',
    correct: '正解！',
    wrong: '不正解！',
    timeout: 'タイムアウト！',
    gameover: 'ゲームオーバー',
    playAgain: 'もう一度',
    accuracy: '正確率',
  },
}

const TOTAL_QUESTIONS = 30
const QUESTION_LIMIT_MS = 3000
const MAX_LIVES = 3
const COLOR_KEYS: readonly ColorKey[] = [
  'red',
  'orange',
  'yellow',
  'pink',
  'coral',
]

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function pickColor(exclude?: ColorKey): ColorKey {
  const pool = COLOR_KEYS.filter((c) => c !== exclude)
  const item = pool[Math.floor(Math.random() * pool.length)]
  return (item ?? 'red') as ColorKey
}

/** Speed coefficient: clamp(1.5 - reactionTime/limit, 0.5, 1.5) */
function speedCoefficient(reactionTimeMs: number, limitMs: number): number {
  return Math.max(0.5, Math.min(1.5, 1.5 - reactionTimeMs / limitMs))
}

/** Consistency coefficient: incongruent=1.5, congruent=1.0 */
function consistencyCoefficient(congruent: boolean): number {
  return congruent ? 1.0 : 1.5
}

interface Question {
  wordKey: ColorKey
  colorKey: ColorKey
  options: ColorKey[]
  congruent: boolean
}

function buildQuestion(): Question {
  // 80% incongruent, 20% congruent
  const congruent = Math.random() < 0.2
  const wordKey = pickColor()
  const colorKey = congruent ? wordKey : pickColor(wordKey)
  // Build 4 options including the correct color
  const wrongs = COLOR_KEYS.filter((c) => c !== colorKey)
  // shuffle wrongs and take 3
  for (let i = wrongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = wrongs[i]
    if (tmp !== undefined) {
      wrongs[i] = wrongs[j] as ColorKey
      wrongs[j] = tmp
    }
  }
  const selectedWrongs = wrongs.slice(0, 3)
  const options = [...selectedWrongs, colorKey]
  // shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = options[i]
    if (tmp !== undefined) {
      options[i] = options[j] as ColorKey
      options[j] = tmp
    }
  }
  return { wordKey, colorKey, options, congruent }
}

export interface StroopChallengeGameProps {
  locale: Locale
}

export function StroopChallengeGame({ locale }: StroopChallengeGameProps) {
  const { t: tt } = useTranslation(locale)
  const loc = getLocale(locale)
  const t = TEXTS[loc]
  const colors = COLOR_MAP[loc]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [phase, setPhase] = useState<Phase>('showing')
  const [question, setQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [errors, setErrors] = useState(0)
  const [feedback, setFeedback] = useState<
    'none' | 'correct' | 'wrong' | 'timeout'
  >('none')
  const [timeLeft, setTimeLeft] = useState(QUESTION_LIMIT_MS)

  const questionStartRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)
  const livesRef = useRef(MAX_LIVES)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
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

  const updateLives = useCallback((newLives: number) => {
    livesRef.current = newLives
    setLives(newLives)
  }, [])

  const nextQuestion = useCallback(
    (n: number) => {
      if (n > TOTAL_QUESTIONS || livesRef.current <= 0) {
        finishGame()
        return
      }
      const q = buildQuestion()
      setQuestion(q)
      setQuestionNumber(n)
      setFeedback('none')
      setTimeLeft(QUESTION_LIMIT_MS)
      setPhase('showing')
      questionStartRef.current = Date.now()

      clearTimers()
      intervalRef.current = setInterval(() => {
        const remaining =
          QUESTION_LIMIT_MS - (Date.now() - questionStartRef.current)
        setTimeLeft(remaining > 0 ? remaining : 0)
      }, 50)

      timeoutRef.current = setTimeout(() => {
        // timeout: -1 life, count as error
        const newLives = livesRef.current - 1
        updateLives(newLives)
        setErrors((e) => e + 1)
        setAnsweredCount((c) => c + 1)
        setFeedback('timeout')
        setPhase('feedback')
        timeoutRef.current = null
        clearTimers()
        if (newLives <= 0) {
          feedbackTimerRef.current = setTimeout(() => finishGame(), 800)
        } else {
          feedbackTimerRef.current = setTimeout(() => nextQuestion(n + 1), 800)
        }
      }, QUESTION_LIMIT_MS)
    },
    [clearTimers, finishGame, updateLives]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    setScore(0)
    updateLives(MAX_LIVES)
    setCorrectCount(0)
    setAnsweredCount(0)
    setErrors(0)
    setQuestionNumber(1)
    setStatus('playing')
    nextQuestion(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextQuestion, updateLives])

  const handleAnswer = (key: ColorKey) => {
    if (phase !== 'showing' || !question) return
    clearTimers()
    setAnsweredCount((c) => c + 1)
    const rt = Date.now() - questionStartRef.current

    if (key === question.colorKey) {
      // Per-question score = 100 × speedCoef × consistencyCoef
      const qScore = Math.round(
        100 *
          speedCoefficient(rt, QUESTION_LIMIT_MS) *
          consistencyCoefficient(question.congruent)
      )
      setScore((s) => s + qScore)
      setCorrectCount((c) => c + 1)
      setFeedback('correct')
    } else {
      const newLives = livesRef.current - 1
      updateLives(newLives)
      setErrors((e) => e + 1)
      setFeedback('wrong')
      if (newLives <= 0) {
        setPhase('feedback')
        feedbackTimerRef.current = setTimeout(() => finishGame(), 800)
        return
      }
    }
    setPhase('feedback')
    feedbackTimerRef.current = setTimeout(() => {
      nextQuestion(questionNumber + 1)
    }, 700)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
  // Final = max(0, Σ question scores − errors × 80)
  const finalScore = Math.max(0, score - errors * 80)

  if (status === 'idle') {
    return (
      <Card className="border-primary-light bg-primary-bg">
        <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dim-executive/15">
            <Shuffle className="h-8 w-8 text-dim-executive" />
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
        accuracy={accuracy}
        dimension="executive"
        onRetry={startGame}
        stats={[{ label: t.lives, value: `${lives}/${MAX_LIVES}` }]}
      />
    )
  }

  const progressPercent = ((questionNumber - 1) / TOTAL_QUESTIONS) * 100

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">
              {questionNumber}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.score}</span>
            <span className="text-md font-bold text-primary">{score}</span>
          </div>
          <div className="flex items-center gap-xs">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart
                key={i}
                className={[
                  'h-4 w-4',
                  i < lives ? 'fill-error text-error' : 'text-border',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        <Progress value={progressPercent} dimension="default" className="h-1.5" />

        <div className="flex flex-col items-center justify-center rounded-lg bg-background-secondary p-3xl min-h-[160px]">
          {question && (
            <span
              className="rounded-full px-2xl py-md text-5xl font-bold text-text-primary"
              style={{ backgroundColor: colors[question.colorKey].hex }}
            >
              {colors[question.wordKey].label}
            </span>
          )}
          <span className="mt-md text-sm text-text-muted">{t.question}</span>
          {feedback !== 'none' && (
            <span
              className={[
                'mt-sm text-sm font-semibold',
                feedback === 'correct' ? 'text-success' : 'text-error',
              ].join(' ')}
            >
              {feedback === 'correct'
                ? t.correct
                : feedback === 'timeout'
                  ? t.timeout
                  : t.wrong}
            </span>
          )}
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={QUESTION_LIMIT_MS}
          dimension="executive"
          showNumber
        />

        <div className="grid grid-cols-2 gap-sm">
          {question?.options.map((key) => (
            <Button
              key={key}
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(key)}
              disabled={phase !== 'showing'}
              className="h-14 text-md font-bold text-text-primary"
              style={{ backgroundColor: colors[key].hex }}
            >
              {colors[key].label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
