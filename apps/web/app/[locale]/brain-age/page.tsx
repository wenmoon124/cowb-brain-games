import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { getGamesByDimension, type GameDimension } from '@/lib/games'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  Focus,
  Zap,
  Layers,
  Wind,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react'

type BrainAgeTexts = {
  heroBadge: string
  title: string
  subtitle: string
  heroCta: string
  dimensionsSectionTitle: string
  dimensionsSectionSubtitle: string
  gamesLabel: string
  exploreLabel: string
  processTitle: string
  processSubtitle: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string
  scienceTitle: string
  scienceBody: string
  scienceCitation: string
  finalCtaTitle: string
  finalCtaSubtitle: string
  startButton: string
}

const BRAIN_AGE_TEXTS: Record<Locale, BrainAgeTexts> = {
  en: {
    heroBadge: 'Science-based assessment',
    title: 'Brain Age Assessment',
    subtitle:
      'Measure your cognitive fitness across five core dimensions and discover your brain age — a single number that reflects how sharp your mind is today.',
    heroCta: 'Explore dimensions',
    dimensionsSectionTitle: 'Five cognitive dimensions',
    dimensionsSectionSubtitle:
      'Your brain age is computed from performance across the five pillars below. Each dimension is trained by dedicated games.',
    gamesLabel: '{count} games',
    exploreLabel: 'Explore games',
    processTitle: 'How assessment works',
    processSubtitle: 'Three simple steps from play to insight.',
    step1Title: 'Play games',
    step1Desc:
      'Train across the five dimensions. Every session contributes to your assessment.',
    step2Title: 'Collect scores',
    step2Desc:
      'Your performance in each dimension is normalized into a 0–100 score.',
    step3Title: 'See your brain age',
    step3Desc:
      'Scores are combined into a brain age, calibrated against your peer group.',
    scienceTitle: 'The science behind brain age',
    scienceBody:
      'Brain age is a composite estimate of cognitive performance relative to a population baseline. It draws on decades of research showing that fluid intelligence, processing speed, and working memory change with age and respond to training. We combine your normalized dimension scores into a single, easy-to-track number.',
    scienceCitation:
      'Synthesized from cognitive aging research (Salthouse, 2009; Park et al., 2002).',
    finalCtaTitle: 'Start your assessment',
    finalCtaSubtitle:
      'Play a few games across each dimension to unlock your first brain age.',
    startButton: 'Start training',
  },
  zh: {
    heroBadge: '基于科学的评估',
    title: '大脑年龄评估',
    subtitle:
      '从五大核心维度衡量你的认知健康，并得出你的大脑年龄——一个反映你当下思维敏捷程度的综合数字。',
    heroCta: '探索各维度',
    dimensionsSectionTitle: '五大认知维度',
    dimensionsSectionSubtitle:
      '你的大脑年龄由以下五大维度的表现综合计算得出，每个维度都有专属游戏进行训练。',
    gamesLabel: '{count} 个游戏',
    exploreLabel: '探索游戏',
    processTitle: '评估流程',
    processSubtitle: '从游戏到洞察，只需三步。',
    step1Title: '玩游戏',
    step1Desc: '在五大维度中进行训练，每一次练习都会纳入评估。',
    step2Title: '收集分数',
    step2Desc: '你在每个维度的表现会被归一化为 0–100 的分数。',
    step3Title: '查看大脑年龄',
    step3Desc: '各维度分数将综合为大脑年龄，并按同龄群体进行校准。',
    scienceTitle: '大脑年龄背后的科学',
    scienceBody:
      '大脑年龄是相对于人群基线的认知表现综合估计值。它基于数十年研究：流体智力、处理速度与工作记忆会随年龄变化，并且可以通过训练得到改善。我们将你归一化后的各维度分数整合为一个易于追踪的数字。',
    scienceCitation: '综合自认知老化研究（Salthouse, 2009；Park 等, 2002）。',
    finalCtaTitle: '开始你的评估',
    finalCtaSubtitle: '在每个维度各玩几局游戏，即可解锁你的首个大脑年龄。',
    startButton: '开始训练',
  },
  ja: {
    heroBadge: '科学に基づく評価',
    title: '脳年齢アセスメント',
    subtitle:
      '5つのコア次元で認知の健康度を測り、あなたの脳年齢——今の心の切れ味を示す一つの数字——を導き出します。',
    heroCta: '次元を見る',
    dimensionsSectionTitle: '5つの認知次元',
    dimensionsSectionSubtitle:
      '脳年齢は以下の5つの次元のパフォーマンスから計算されます。各次元には専用のゲームがあります。',
    gamesLabel: '{count} 個のゲーム',
    exploreLabel: 'ゲームを見る',
    processTitle: 'アセスメントの流れ',
    processSubtitle: 'プレイから洞察まで、3つのステップ。',
    step1Title: 'ゲームを遊ぶ',
    step1Desc: '5つの次元で練習します。各セッションが評価に反映されます。',
    step2Title: 'スコアを集める',
    step2Desc: '各次元のパフォーマンスは 0〜100 のスコアに正規化されます。',
    step3Title: '脳年齢を確認',
    step3Desc: 'スコアを統合し、同年齢層で較正した脳年齢を算出します。',
    scienceTitle: '脳年齢の背後にある科学',
    scienceBody:
      '脳年齢は、集団ベースラインに対する認知パフォーマンスの複合推定値です。流動性知性・処理速度・ワーキングメモリが加齢とともに変化し、訓練によって向上するという長年の研究に基づいています。正規化した次元スコアを追跡しやすい一つの数字にまとめます。',
    scienceCitation: '認知加齢研究より総合（Salthouse, 2009; Park et al., 2002）。',
    finalCtaTitle: 'アセスメントを始める',
    finalCtaSubtitle: '各次元でいくつかゲームを遊んで、最初の脳年齢を解放しましょう。',
    startButton: 'トレーニング開始',
  },
}

type DimensionEntry = {
  key: GameDimension
  icon: LucideIcon
  bgClass: string
  textClass: string
  descriptions: Record<Locale, string>
}

const DIMENSIONS: ReadonlyArray<DimensionEntry> = [
  {
    key: 'memory',
    icon: Brain,
    bgClass: 'bg-dim-memory/15',
    textClass: 'text-dim-memory-text',
    descriptions: {
      en: 'Recall and retain information across short and long intervals.',
      zh: '在短时间与长时间间隔内回忆并保留信息。',
      ja: '短期・長期の間隔で情報を記憶し保持する。',
    },
  },
  {
    key: 'attention',
    icon: Focus,
    bgClass: 'bg-dim-attention/15',
    textClass: 'text-dim-attention-text',
    descriptions: {
      en: 'Sustain focus and filter out distractions.',
      zh: '保持专注并过滤干扰。',
      ja: '集中力を維持し気を散らす要素を除外する。',
    },
  },
  {
    key: 'reaction',
    icon: Zap,
    bgClass: 'bg-dim-reaction/15',
    textClass: 'text-dim-reaction-text',
    descriptions: {
      en: 'Respond quickly and accurately to stimuli.',
      zh: '对刺激做出快速且准确的反应。',
      ja: '刺激に素早く正確に反応する。',
    },
  },
  {
    key: 'executive',
    icon: Layers,
    bgClass: 'bg-dim-executive/15',
    textClass: 'text-dim-executive-text',
    descriptions: {
      en: 'Plan, switch tasks, and resolve conflicts.',
      zh: '规划、切换任务并解决冲突。',
      ja: '計画し、タスクを切り替え、競合を解決する。',
    },
  },
  {
    key: 'relaxation',
    icon: Wind,
    bgClass: 'bg-dim-relaxation/15',
    textClass: 'text-dim-relaxation-text',
    descriptions: {
      en: 'Regulate stress and settle the mind.',
      zh: '调节压力、安定心神。',
      ja: 'ストレスを調整し心を落ち着かせる。',
    },
  },
]

const PROCESS_STEPS = [
  { icon: Brain, step: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: Target, step: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: CheckCircle, step: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
] as const

function gameCountLabel(template: string, count: number): string {
  return template.replace('{count}', String(count))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = BRAIN_AGE_TEXTS[locale]
  const pathPrefix = `/${locale}/brain-age`

  return {
    title: texts.title,
    description: texts.subtitle,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/brain-age',
        zh: '/zh/brain-age',
        ja: '/ja/brain-age',
        'x-default': '/en/brain-age',
      },
    },
    openGraph: {
      title: texts.title,
      description: texts.subtitle,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function BrainAgePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const texts = BRAIN_AGE_TEXTS[locale]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-hero px-md py-3xl md:py-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" className="mb-lg">
            <Sparkles className="mr-xs h-3 w-3" />
            {texts.heroBadge}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-lg leading-tight">
            {texts.title}
          </h1>
          <p className="text-md md:text-lg text-text-secondary mb-2xl max-w-2xl mx-auto">
            {texts.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href={`/${locale}/games`}>
                {texts.heroCta}
                <ArrowRight className="ml-xs h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href={`/${locale}/about`}>
                {t('common.buttons.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Five Dimensions Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
              {texts.dimensionsSectionTitle}
            </h2>
            <p className="text-sm md:text-md text-text-secondary max-w-2xl mx-auto">
              {texts.dimensionsSectionSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-lg">
            {DIMENSIONS.map((dim) => {
              const count = getGamesByDimension(dim.key).length
              const Icon = dim.icon
              return (
                <Card
                  key={dim.key}
                  className="border-primary-light flex flex-col"
                >
                  <CardHeader>
                    <div className="mb-md flex h-10 w-10 items-center justify-center rounded-md bg-primary-light">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant={dim.key} className="mb-xs w-fit">
                      {t(`games.dimensions.${dim.key}`)}
                    </Badge>
                    <CardTitle className="text-text-primary">
                      {t(`games.dimensions.${dim.key}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-md">
                    <p className="text-sm text-text-secondary flex-1">
                      {dim.descriptions[locale]}
                    </p>
                    <div
                      className={`flex items-center gap-xs rounded-md ${dim.bgClass} px-md py-sm`}
                    >
                      <Clock className={`h-3 w-3 ${dim.textClass}`} />
                      <span className={`text-xs font-medium ${dim.textClass}`}>
                        {gameCountLabel(texts.gamesLabel, count)}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/${locale}/games?dimension=${dim.key}`}>
                        {texts.exploreLabel}
                        <ArrowRight className="ml-xs h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Assessment Process Section */}
      <section className="bg-background-secondary px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
              {texts.processTitle}
            </h2>
            <p className="text-sm md:text-md text-text-secondary max-w-2xl mx-auto">
              {texts.processSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.step} className="border-primary-light text-center">
                  <CardHeader>
                    <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mx-auto mb-xs flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <CardTitle className="text-text-primary">
                      {texts[step.titleKey]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary">
                      {texts[step.descKey]}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary-light">
            <CardContent className="p-xl">
              <div className="mb-md flex items-center gap-sm">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                  {texts.scienceTitle}
                </h2>
              </div>
              <p className="text-md text-text-secondary leading-relaxed mb-md">
                {texts.scienceBody}
              </p>
              <p className="text-xs text-text-muted italic">
                {texts.scienceCitation}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-hero px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {texts.finalCtaTitle}
          </h2>
          <p className="text-md text-text-secondary mb-2xl max-w-xl mx-auto">
            {texts.finalCtaSubtitle}
          </p>
          <Button variant="primary" size="xl" asChild>
            <Link href={`/${locale}/games`}>
              {texts.startButton}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
