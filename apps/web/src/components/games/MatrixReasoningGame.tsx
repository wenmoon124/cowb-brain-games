'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameTimer } from '@/components/games/GameTimer'
import { GameResult } from '@/components/games/GameResult'
import { GameRules } from '@/components/games/GameRules'
import { Play } from 'lucide-react'

type GameStatus = 'idle' | 'playing' | 'finished'
type Shape = 'circle' | 'square' | 'triangle'
type PatternType = 'color' | 'shape' | 'count' | 'rotation' | 'combination'
type Locale = 'en' | 'zh' | 'ja'

interface MCell {
  shape: Shape
  color: string
  count: number
  rotation: number
}

interface Texts {
  title: string
  description: string
  dimensionLabel: string
  start: string
  question: string
  rules: string[]
  scoring: string[]
  tips: string[]
  correct: string
  wrong: string
  timeout: string
  accuracy: string
  avgRt: string
}

const TEXTS: Record<Locale, Texts> = {
  en: {
    title: 'Matrix Reasoning',
    description:
      'Find the rule across the 3×3 grid and pick the missing cell. 10 puzzles, 3 errors ends.',
    dimensionLabel: 'Executive',
    start: 'Start',
    question: 'Pick the missing piece',
    rules: [
      'Each grid follows a hidden rule across rows and columns.',
      'The bottom-right cell is missing — choose it from 4 options.',
      'Rules grow harder: color, shape, count, rotation, then combined.',
      '30s per puzzle; 3 wrong answers ends the game.',
    ],
    scoring: [
      'Correct = clamp(1000 − rt, 100, 1000) × difficulty (1.0–2.5).',
      'Wrong or timeout = −100.',
      'Total = sum of all puzzles.',
    ],
    tips: [
      'Scan one attribute at a time (color, then shape, then count).',
      'Check both the row and the column of the missing cell.',
    ],
    correct: 'Correct!',
    wrong: 'Wrong!',
    timeout: 'Timeout!',
    accuracy: 'Accuracy',
    avgRt: 'Avg. Time',
  },
  zh: {
    title: '矩阵推理',
    description: '找出 3×3 网格的规律，选择缺失的格子。共 10 题，3 次错误结束。',
    dimensionLabel: '执行',
    start: '开始',
    question: '选出缺失的一块',
    rules: [
      '每个网格遵循一个隐藏规律。',
      '右下角格子缺失——从 4 个选项中选出。',
      '规律渐难：颜色、形状、数量、旋转、组合。',
      '每题 30 秒，3 次错误结束。',
    ],
    scoring: [
      '正确 = clamp(1000 − rt, 100, 1000) × 难度(1.0–2.5)。',
      '错误或超时 = −100。',
      '总分 = 各题之和。',
    ],
    tips: ['每次只看一个属性（先颜色、再形状、再数量）。', '同时检查缺失格的行与列。'],
    correct: '正确！',
    wrong: '错误！',
    timeout: '超时！',
    accuracy: '准确率',
    avgRt: '平均时间',
  },
  ja: {
    title: 'マトリックス推論',
    description: '3×3グリッドの法則を見つけ、欠けマスを選ぶ。全10問、3回失敗で終了。',
    dimensionLabel: '実行',
    start: '開始',
    question: '欠けたピースを選ぶ',
    rules: [
      '各グリッドは隠れた法則に従う。',
      '右下マスが欠け—4つの選択肢から選ぶ。',
      '法則は困難へ：色、図形、数、回転、組み合わせ。',
      '各問30秒、3回失敗で終了。',
    ],
    scoring: [
      '正解 = clamp(1000 − rt, 100, 1000) × 難易度(1.0–2.5)。',
      '不正解・タイムアウト = −100。',
      '合計 = 全問の合計。',
    ],
    tips: ['一度に一属性ずつ確認。', '欠けマスの行と列を両方確認。'],
    correct: '正解！',
    wrong: '不正解！',
    timeout: 'タイムアウト！',
    accuracy: '正確率',
    avgRt: '平均時間',
  },
}

const TOTAL_QUESTIONS = 10
const QUESTION_LIMIT_MS = 30000
const MAX_ERRORS = 3
const SHAPES: readonly Shape[] = ['circle', 'square', 'triangle']
const COLORS: readonly string[] = ['#FF6B35', '#FFB14A', '#F472B6']

function getLocale(locale: string): Locale {
  return locale === 'zh' || locale === 'ja' ? locale : 'en'
}

function pick<T>(arr: readonly T[], exclude?: T): T {
  const pool = arr.filter((x) => x !== exclude)
  const item = pool[Math.floor(Math.random() * pool.length)]
  return (item ?? arr[0]) as T
}

function cellsEqual(a: MCell, b: MCell): boolean {
  return (
    a.shape === b.shape &&
    a.color === b.color &&
    a.count === b.count &&
    a.rotation === b.rotation
  )
}

function patternForQuestion(q: number): { type: PatternType; coeff: number } {
  if (q <= 2) return { type: 'color', coeff: 1.0 }
  if (q <= 4) return { type: 'shape', coeff: 1.3 }
  if (q <= 6) return { type: 'count', coeff: 1.6 }
  if (q <= 8) return { type: 'rotation', coeff: 2.0 }
  return { type: 'combination', coeff: 2.5 }
}

function buildMatrix(type: PatternType): MCell[] {
  const baseShape = pick(SHAPES)
  const baseColor = pick(COLORS)
  const colorA = pick(COLORS)
  const colorB = pick(COLORS, colorA)
  const shapeA = pick(SHAPES)
  const shapeB = pick(SHAPES, shapeA)
  const cells: MCell[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let cell: MCell
      switch (type) {
        case 'color':
          cell = {
            shape: baseShape,
            color: (r + c) % 2 === 0 ? colorA : colorB,
            count: 1,
            rotation: 0,
          }
          break
        case 'shape':
          cell = {
            shape: (r + c) % 2 === 0 ? shapeA : shapeB,
            color: baseColor,
            count: 1,
            rotation: 0,
          }
          break
        case 'count':
          cell = {
            shape: baseShape,
            color: baseColor,
            count: c + 1,
            rotation: 0,
          }
          break
        case 'rotation':
          cell = {
            shape: 'triangle',
            color: baseColor,
            count: 1,
            rotation: ((r + c) * 90) % 360,
          }
          break
        case 'combination':
          cell = {
            shape: c % 2 === 0 ? shapeA : shapeB,
            color: r % 2 === 0 ? colorA : colorB,
            count: 1,
            rotation: 0,
          }
          break
      }
      cells.push(cell)
    }
  }
  return cells
}

function buildOptions(answer: MCell): MCell[] {
  const distractors: MCell[] = []
  const seen = new Set<string>([JSON.stringify(answer)])
  const tryAdd = (cell: MCell) => {
    if (cellsEqual(cell, answer)) return
    const k = JSON.stringify(cell)
    if (seen.has(k)) return
    seen.add(k)
    distractors.push(cell)
  }
  // distractor: wrong color
  tryAdd({ ...answer, color: pick(COLORS, answer.color) })
  // distractor: wrong shape
  tryAdd({ ...answer, shape: pick(SHAPES, answer.shape) })
  // distractor: wrong count
  const counts = [1, 2, 3].filter((n) => n !== answer.count)
  tryAdd({ ...answer, count: counts[0] ?? 2 })
  // distractor: wrong rotation
  const rots = [0, 90, 180, 270].filter((n) => n !== answer.rotation)
  tryAdd({ ...answer, rotation: rots[0] ?? 90 })

  while (distractors.length < 3) {
    tryAdd({
      ...answer,
      color: pick(COLORS, answer.color),
      shape: pick(SHAPES, answer.shape),
    })
  }
  const options = [answer, ...distractors.slice(0, 3)]
  // shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = options[i]
    const other = options[j]
    if (tmp !== undefined && other !== undefined) {
      options[i] = other
      options[j] = tmp
    }
  }
  return options
}

function ShapeSvg({ cell, size = 60 }: { cell: MCell; size?: number }) {
  const r = size / 2
  const shapeSize = Math.max(6, size * 0.22)
  const positions: number[] =
    cell.count === 1
      ? [r]
      : cell.count === 2
        ? [size * 0.3, size * 0.7]
        : [size * 0.25, r, size * 0.75]
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {positions.map((cx, i) => {
        const cy = r
        const transform = `rotate(${cell.rotation} ${cx} ${cy})`
        const key = `${i}-${cx}`
        if (cell.shape === 'circle') {
          return (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={shapeSize}
              fill={cell.color}
              transform={transform}
            />
          )
        }
        if (cell.shape === 'square') {
          return (
            <rect
              key={key}
              x={cx - shapeSize}
              y={cy - shapeSize}
              width={shapeSize * 2}
              height={shapeSize * 2}
              fill={cell.color}
              transform={transform}
              rx={2}
            />
          )
        }
        const pts = `${cx},${cy - shapeSize} ${cx + shapeSize},${cy + shapeSize} ${cx - shapeSize},${cy + shapeSize}`
        return (
          <polygon
            key={key}
            points={pts}
            fill={cell.color}
            transform={transform}
          />
        )
      })}
    </svg>
  )
}

export interface MatrixReasoningGameProps {
  locale: string
}

export function MatrixReasoningGame({ locale }: MatrixReasoningGameProps) {
  const t = TEXTS[getLocale(locale)]

  const [status, setStatus] = useState<GameStatus>('idle')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [matrix, setMatrix] = useState<MCell[]>([])
  const [options, setOptions] = useState<MCell[]>([])
  const [answer, setAnswer] = useState<MCell | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
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
      const { type } = patternForQuestion(n)
      const cells = buildMatrix(type)
      const ans = cells[8]
      if (ans === undefined) return
      setMatrix(cells)
      setAnswer(ans)
      setOptions(buildOptions(ans))
      setSelected(null)
      setFeedback('none')
      setTimeLeft(QUESTION_LIMIT_MS)
      setQuestionNumber(n)
      questionStartRef.current = Date.now()

      clearTimers()
      intervalRef.current = setInterval(() => {
        const remaining =
          QUESTION_LIMIT_MS - (Date.now() - questionStartRef.current)
        setTimeLeft(remaining > 0 ? remaining : 0)
      }, 100)

      timeoutRef.current = setTimeout(() => {
        const newErrors = errorsRef.current + 1
        errorsRef.current = newErrors
        setErrors(newErrors)
        setScore((s) => s - 100)
        setAnsweredCount((c) => c + 1)
        setFeedback('timeout')
        clearTimers()
        if (newErrors >= MAX_ERRORS) {
          feedbackTimerRef.current = setTimeout(() => finishGame(), 800)
        } else {
          feedbackTimerRef.current = setTimeout(
            () => nextQuestion(n + 1),
            800
          )
        }
      }, QUESTION_LIMIT_MS)
    },
    [clearTimers, finishGame]
  )

  const startGame = useCallback(() => {
    finishedRef.current = false
    errorsRef.current = 0
    setScore(0)
    setErrors(0)
    setCorrectCount(0)
    setAnsweredCount(0)
    setReactionTimes([])
    setQuestionNumber(1)
    setStatus('playing')
    nextQuestion(1)
  }, [nextQuestion])

  const handleOptionClick = (idx: number) => {
    if (feedback !== 'none' || answer === null) return
    const choice = options[idx]
    if (choice === undefined) return
    clearTimers()
    setSelected(idx)
    setAnsweredCount((c) => c + 1)
    if (cellsEqual(choice, answer)) {
      const rt = Date.now() - questionStartRef.current
      const { coeff } = patternForQuestion(questionNumber)
      const base = Math.min(1000, Math.max(100, 1000 - rt))
      const gained = Math.round(base * coeff)
      setScore((s) => s + gained)
      setCorrectCount((c) => c + 1)
      setReactionTimes((prev) => [...prev, rt])
      setFeedback('correct')
    } else {
      const newErrors = errorsRef.current + 1
      errorsRef.current = newErrors
      setErrors(newErrors)
      setScore((s) => s - 100)
      setFeedback('wrong')
      if (newErrors >= MAX_ERRORS) {
        feedbackTimerRef.current = setTimeout(() => finishGame(), 800)
        return
      }
    }
    feedbackTimerRef.current = setTimeout(
      () => nextQuestion(questionNumber + 1),
      700
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
        score={score}
        accuracy={accuracy}
        dimension="executive"
        onRetry={startGame}
        stats={[
          { label: t.avgRt, value: `${avgRt}ms` },
          { label: t.correct, value: `${correctCount}/${answeredCount}` },
          { label: t.wrong, value: `${errors}/${MAX_ERRORS}` },
        ]}
      />
    )
  }

  const isCorrectChoice =
    feedback !== 'none' &&
    selected !== null &&
    options[selected] !== undefined &&
    answer !== null &&
    options[selected] !== undefined &&
    cellsEqual(options[selected]!, answer)

  return (
    <Card className="border-primary-light">
      <CardContent className="flex flex-col gap-md p-lg">
        <div className="flex items-center justify-between gap-md">
          <span className="text-xs text-text-muted">
            {questionNumber}/{TOTAL_QUESTIONS}
          </span>
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

        <div className="flex flex-col items-center gap-sm">
          <span className="text-xs text-text-muted">{t.question}</span>
          <div
            className="grid grid-cols-3 gap-xs rounded-lg bg-background-secondary p-md"
            style={{ width: 'min(100%, 240px)' }}
          >
            {matrix.map((cell, i) => {
              const isMissing = i === 8
              const showAsCorrect =
                isMissing && feedback !== 'none' && answer !== null
              return (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md bg-card"
                >
                  {isMissing ? (
                    showAsCorrect && answer !== null ? (
                      <ShapeSvg cell={answer} size={56} />
                    ) : (
                      <span className="text-2xl font-bold text-text-muted">
                        ?
                      </span>
                    )
                  ) : (
                    <ShapeSvg cell={cell} size={56} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {feedback !== 'none' && (
          <div className="flex items-center justify-center min-h-[20px]">
            <span
              className={[
                'text-sm font-semibold',
                isCorrectChoice ? 'text-success' : 'text-error',
              ].join(' ')}
            >
              {feedback === 'correct'
                ? t.correct
                : feedback === 'timeout'
                  ? t.timeout
                  : t.wrong}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
          {options.map((opt, i) => {
            const isChosen = selected === i
            const isAnswer =
              feedback !== 'none' && answer !== null && cellsEqual(opt, answer)
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleOptionClick(i)}
                disabled={feedback !== 'none'}
                aria-label={`${t.question} ${i + 1}`}
                className={[
                  'flex aspect-square items-center justify-center rounded-md border-2 bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isAnswer
                    ? 'border-success'
                    : isChosen
                      ? 'border-error'
                      : 'border-border hover:border-primary',
                ].join(' ')}
              >
                <ShapeSvg cell={opt} size={56} />
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
