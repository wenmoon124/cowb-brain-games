'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameRules } from '@/components/games/GameRules'
import { Shuffle, Play } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Task = 'shape' | 'color'
type Shape = 'circle' | 'square'
type StimColor = 'orange' | 'pink'
type Side = 'left' | 'right'

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  task: string
  shapeTask: string
  colorTask: string
  switchBanner: string
  left: string
  right: string
  correct: string
  wrong: string
  timeout: string
  rules: string[]
  scoring: string[]
  tips: string[]
  accuracy: string
  switches: string
  avgRt: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Change Flex',
    description:
      'Respond by the current rule — shapes or colors. The rule swaps without warning. 30 trials.',
    dimensionLabel: 'Executive',
    start: 'Start',
    task: 'Task',
    shapeTask: 'Shape',
    colorTask: 'Color',
    switchBanner: 'Rule changed!',
    left: 'Left',
    right: 'Right',
    correct: 'Correct!',
    wrong: 'Wrong!',
    timeout: 'Timeout!',
    rules: [
      'Shape rule: circle = Left, square = Right.',
      'Color rule: orange = Left, pink = Right.',
      'The active rule switches now and then — watch the banner.',
      'Answer each trial within 6s. 3 errors ends the game.',
    ],
    scoring: [
      'Correct = clamp(500 − rt, 50, 500) × 1.5 on the first trial after a switch, else × 1.0.',
      'Wrong or timeout = −50.',
      'Total = sum of all trials.',
    ],
    tips: [
      'Read the task label every trial before answering.',
      'Slow down right after a switch to avoid errors.',
    ],
    accuracy: 'Accuracy',
    switches: 'Switches',
    avgRt: 'Avg. Time',
  },
  zh: {
    title: '任务切换',
    description: '按当前规则响应——形状或颜色，规则会突然切换。共 30 题。',
    dimensionLabel: '执行',
    start: '开始',
    task: '任务',
    shapeTask: '形状',
    colorTask: '颜色',
    switchBanner: '规则已切换！',
    left: '左',
    right: '右',
    correct: '正确！',
    wrong: '错误！',
    timeout: '超时！',
    rules: [
      '形状规则：圆形=左，方形=右。',
      '颜色规则：橙色=左，粉色=右。',
      '当前规则会偶尔切换——留意提示。',
      '每题 6 秒内作答，3 次错误结束。',
    ],
    scoring: [
      '正确 = clamp(500 − rt, 50, 500) × 切换后首题 1.5，否则 × 1.0。',
      '错误或超时 = −50。',
      '总分 = 各题之和。',
    ],
    tips: ['每题先读任务标签再作答。', '切换后稍慢一点避免出错。'],
    accuracy: '准确率',
    switches: '切换次数',
    avgRt: '平均时间',
  },
  ja: {
    title: 'チェンジフレックス',
    description: '現在のルールで応答—図形か色か。ルールは不意に切り替わります。全30問。',
    dimensionLabel: '実行',
    start: '開始',
    task: 'タスク',
    shapeTask: '図形',
    colorTask: '色',
    switchBanner: 'ルール変更！',
    left: '左',
    right: '右',
    correct: '正解！',
    wrong: '不正解！',
    timeout: 'タイムアウト！',
    rules: [
      '図形ルール：丸=左、四角=右。',
      '色ルール：オレンジ=左、ピンク=右。',
      'ルールは時々切り替わります—バナーに注目。',
      '各問6秒以内、3回失敗で終了。',
    ],
    scoring: [
      '正解 = clamp(500 − rt, 50, 500) × 切替後初問1.5、それ以外×1.0。',
      '不正解・タイムアウト = −50。',
      '合計 = 全問の合計。',
    ],
    tips: ['毎問、タスクラベルを確認してから応答。', '切替直後は少し慎重に。'],
    accuracy: '正確率',
    switches: '切替回数',
    avgRt: '平均時間',
  },
}

const TOTAL_QUESTIONS = 30
const QUESTION_LIMIT_MS = 6000
const MAX_ERRORS = 3
const ORANGE_HEX = '#FF6B35'
const PINK_HEX = '#F472B6'

interface Stimulus {
  shape: Shape
  color: StimColor
}

function getLocale(locale: Locale): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function randomStimulus(): Stimulus {
  const shape: Shape = Math.random() < 0.5 ? 'circle' : 'square'
  const color: StimColor = Math.random() < 0.5 ? 'orange' : 'pink'
  return { shape, color }
}

function correctSide(task: Task, s: Stimulus): Side {
  if (task === 'shape') return s.shape === 'circle' ? 'left' : 'right'
  return s.color === 'orange' ? 'left' : 'right'
}

export interface ChangeFlexGameProps {
  locale: Locale
}

export function ChangeFlexGame({ locale }: ChangeFlexGameProps) {
  const { t: tt } = useTranslation(locale)
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [task, setTask] = useState<Task>('shape')
  const [stimulus, setStimulus] = useState<Stimulus | null>(null)
  const [isSwitchFirst, setIsSwitchFirst] = useState(false)
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [switchCount, setSwitchCount] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [feedback, setFeedback] = useState<
    'none' | 'correct' | 'wrong' | 'timeout'
  >('none')
  const [timeLeft, setTimeLeft] = useState(QUESTION_LIMIT_MS)

  const questionStartRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishedRef = useRef(false)
  const errorsRef = useRef(0)
  const taskRef = useRef<Task>('shape')
  const sinceSwitchRef = useRef(0)
  const switchTargetRef = useRef(4)

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

  const nextQuestion = useCallback(
    (n: number) => {
      if (n > TOTAL_QUESTIONS || errorsRef.current >= MAX_ERRORS) {
        finishGame()
        return
      }
      // decide switch
      let switched = false
      let activeTask = taskRef.current
      if (n > 1 && sinceSwitchRef.current >= switchTargetRef.current) {
        activeTask = activeTask === 'shape' ? 'color' : 'shape'
        taskRef.current = activeTask
        sinceSwitchRef.current = 0
        switchTargetRef.current = 4 + Math.floor(Math.random() * 2) // 4 or 5
        switched = true
      } else {
        sinceSwitchRef.current += 1
      }
      setTask(activeTask)
      setIsSwitchFirst(switched)
      if (switched) setSwitchCount((c) => c + 1)
      setStimulus(randomStimulus())
      setFeedback('none')
      setTimeLeft(QUESTION_LIMIT_MS)
      setQuestionNumber(n)
      questionStartRef.current = Date.now()

      clearTimers()
      intervalRef.current = setInterval(() => {
        const remaining =
          QUESTION_LIMIT_MS - (Date.now() - questionStartRef.current)
        setTimeLeft(remaining > 0 ? remaining : 0)
      }, 50)

      timeoutRef.current = setTimeout(() => {
        // timeout = wrong
        const newErrors = errorsRef.current + 1
        errorsRef.current = newErrors
        setErrors(newErrors)
        setScore((s) => s - 50)
        setAnsweredCount((c) => c + 1)
        setFeedback('timeout')
        clearTimers()
        if (newErrors >= MAX_ERRORS) {
          feedbackTimerRef.current = setTimeout(() => finishGame(), 700)
        } else {
          feedbackTimerRef.current = setTimeout(
            () => nextQuestion(n + 1),
            700
          )
        }
      }, QUESTION_LIMIT_MS)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    errorsRef.current = 0
    taskRef.current = 'shape'
    sinceSwitchRef.current = 0
    switchTargetRef.current = 4
    setScore(0)
    setErrors(0)
    setCorrectCount(0)
    setAnsweredCount(0)
    setSwitchCount(0)
    setReactionTimes([])
    setQuestionNumber(1)
    setStatus('playing')
    nextQuestion(1)
  }, [nextQuestion])

  const handleAnswer = (side: Side) => {
    if (!stimulus || feedback !== 'none') return
    clearTimers()
    setAnsweredCount((c) => c + 1)
    const expected = correctSide(taskRef.current, stimulus)
    if (side === expected) {
      const rt = Date.now() - questionStartRef.current
      const base = Math.min(500, Math.max(50, 500 - rt))
      const mult = isSwitchFirst ? 1.5 : 1.0
      const gained = Math.round(base * mult)
      setScore((s) => s + gained)
      setCorrectCount((c) => c + 1)
      setReactionTimes((prev) => [...prev, rt])
      setFeedback('correct')
    } else {
      const newErrors = errorsRef.current + 1
      errorsRef.current = newErrors
      setErrors(newErrors)
      setScore((s) => s - 50)
      setFeedback('wrong')
      if (newErrors >= MAX_ERRORS) {
        feedbackTimerRef.current = setTimeout(() => finishGame(), 700)
        return
      }
    }
    feedbackTimerRef.current = setTimeout(
      () => nextQuestion(questionNumber + 1),
      600
    )
  }

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
  const avgRt =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0

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
        accuracy={accuracy}
        dimension="executive"
        onRetry={startGame}
        stats={[
          { label: t.avgRt, value: `${avgRt}ms` },
          { label: t.switches, value: switchCount },
          { label: t.correct, value: `${correctCount}/${answeredCount}` },
        ]}
      />
    )
  }

  const stimColorHex = stimulus?.color === 'orange' ? ORANGE_HEX : PINK_HEX

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {questionNumber}/{TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.task}:</span>
            <span className="text-md font-bold text-dim-executive-text">
              {task === 'shape' ? t.shapeTask : t.colorTask}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-xs text-text-muted">{t.wrong}</span>
            <span className="text-md font-bold text-error">
              {errors}/{MAX_ERRORS}
            </span>
          </div>
        </div>

        <GameTimer
          timeLeft={timeLeft}
          totalTime={QUESTION_LIMIT_MS}
          dimension="executive"
          showNumber
          roundLabel={`${questionNumber}/${TOTAL_QUESTIONS}`}
        />

        {isSwitchFirst && (
          <div className="flex items-center justify-center gap-xs rounded-md bg-accent/15 py-xs">
            <Shuffle className="h-4 w-4 text-dim-executive-text" />
            <span className="text-sm font-semibold text-dim-executive-text">
              {t.switchBanner}
            </span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center rounded-lg bg-background-secondary p-3xl min-h-[180px]">
          {stimulus && (
            <div
              className={stimulus.shape === 'circle' ? 'rounded-full' : 'rounded-md'}
              style={{
                width: 96,
                height: 96,
                backgroundColor: stimColorHex,
                boxShadow: `0 0 24px ${stimColorHex}40`,
              }}
              aria-hidden="true"
            />
          )}
          {feedback !== 'none' && (
            <span
              className={[
                'mt-md text-sm font-semibold',
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

        <div className="grid grid-cols-2 gap-sm">
          <Button
            variant="secondary"
            size="xl"
            onClick={() => handleAnswer('left')}
            disabled={feedback !== 'none' || !stimulus}
            className="text-lg font-bold"
          >
            {t.left}
          </Button>
          <Button
            variant="secondary"
            size="xl"
            onClick={() => handleAnswer('right')}
            disabled={feedback !== 'none' || !stimulus}
            className="text-lg font-bold"
          >
            {t.right}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
