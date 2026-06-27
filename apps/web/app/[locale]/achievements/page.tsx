import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { GameDimension } from '@/lib/games'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Trophy,
  Medal,
  Flame,
  Brain,
  Focus,
  Zap,
  Layers,
  Wind,
  ArrowRight,
} from 'lucide-react'

type AchievementPageTexts = {
  title: string
  subtitle: string
  demoBadge: string
  statsTitle: string
  statTotalLabel: string
  statUnlockedLabel: string
  statProgressLabel: string
  gameCategoryTitle: string
  gameCategorySubtitle: string
  streakCategoryTitle: string
  streakCategorySubtitle: string
  dimensionCategoryTitle: string
  dimensionCategorySubtitle: string
  unlockedLabel: string
  lockedLabel: string
  progressLabel: string
  ctaTitle: string
  ctaSubtitle: string
  ctaButton: string
}

const TEXTS: Record<Locale, AchievementPageTexts> = {
  en: {
    title: 'Achievements',
    subtitle: 'Track your milestones and unlock rewards',
    demoBadge: 'Demo data',
    statsTitle: 'Overview',
    statTotalLabel: 'Total Achievements',
    statUnlockedLabel: 'Unlocked',
    statProgressLabel: 'Progress',
    gameCategoryTitle: 'Game Achievements',
    gameCategorySubtitle: 'Milestones earned through gameplay.',
    streakCategoryTitle: 'Streak Achievements',
    streakCategorySubtitle: 'Rewards for consistent daily training.',
    dimensionCategoryTitle: 'Dimension Mastery',
    dimensionCategorySubtitle: 'Proficiency across the five cognitive dimensions.',
    unlockedLabel: 'Unlocked',
    lockedLabel: 'Locked',
    progressLabel: 'Progress',
    ctaTitle: 'Keep unlocking',
    ctaSubtitle: 'Play more games to unlock remaining achievements.',
    ctaButton: 'Start training',
  },
  zh: {
    title: '成就',
    subtitle: '追踪你的里程碑并解锁奖励',
    demoBadge: '示例数据',
    statsTitle: '总览',
    statTotalLabel: '成就总数',
    statUnlockedLabel: '已解锁',
    statProgressLabel: '完成进度',
    gameCategoryTitle: '游戏成就',
    gameCategorySubtitle: '通过游戏获得的里程碑。',
    streakCategoryTitle: '连续打卡成就',
    streakCategorySubtitle: '坚持每日训练的奖励。',
    dimensionCategoryTitle: '维度精通',
    dimensionCategorySubtitle: '在五大认知维度上的熟练程度。',
    unlockedLabel: '已解锁',
    lockedLabel: '未解锁',
    progressLabel: '进度',
    ctaTitle: '继续解锁',
    ctaSubtitle: '玩更多游戏来解锁剩余成就。',
    ctaButton: '开始训练',
  },
  ja: {
    title: '実績',
    subtitle: 'マイルストーンを追跡し、報酬を解除',
    demoBadge: 'デモデータ',
    statsTitle: '概要',
    statTotalLabel: '実績総数',
    statUnlockedLabel: '解放済み',
    statProgressLabel: '進捗',
    gameCategoryTitle: 'ゲーム実績',
    gameCategorySubtitle: 'ゲームプレイで獲得するマイルストーン。',
    streakCategoryTitle: '連続日数実績',
    streakCategorySubtitle: '毎日のトレーニングで得られる報酬。',
    dimensionCategoryTitle: '次元マスター',
    dimensionCategorySubtitle: '5つの認知次元の熟練度。',
    unlockedLabel: '解放済み',
    lockedLabel: '未解放',
    progressLabel: '進捗',
    ctaTitle: '解除を続ける',
    ctaSubtitle: 'より多くのゲームをプレイして残りの実績を解放しましょう。',
    ctaButton: 'トレーニング開始',
  },
}

type AchievementCategory = 'game' | 'streak' | 'dimension'

type Achievement = {
  id: string
  icon: LucideIcon
  unlocked: boolean
  progress: number
  category: AchievementCategory
  dimension?: GameDimension
  titles: Record<Locale, string>
  descriptions: Record<Locale, string>
}

const ACHIEVEMENTS: ReadonlyArray<Achievement> = [
  // Game Achievements (8)
  {
    id: 'first-game',
    icon: Award,
    unlocked: true,
    progress: 100,
    category: 'game',
    titles: { en: 'First Game', zh: '首局游戏', ja: '初回プレイ' },
    descriptions: {
      en: 'Complete your first training game.',
      zh: '完成你的第一局训练游戏。',
      ja: '最初のトレーニングゲームを完了する。',
    },
  },
  {
    id: 'perfect-score',
    icon: Trophy,
    unlocked: false,
    progress: 60,
    category: 'game',
    titles: { en: 'Perfect Score', zh: '满分通关', ja: 'パーフェクトスコア' },
    descriptions: {
      en: 'Achieve a perfect score in any game.',
      zh: '在任意游戏中获得满分。',
      ja: '任意のゲームでパーフェクトスコアを達成する。',
    },
  },
  {
    id: 'speed-demon',
    icon: Medal,
    unlocked: true,
    progress: 100,
    category: 'game',
    titles: { en: 'Speed Demon', zh: '速度恶魔', ja: 'スピードデーモン' },
    descriptions: {
      en: 'Finish a game in record time.',
      zh: '以破纪录的时间完成游戏。',
      ja: '記録的な速さでゲームを完了する。',
    },
  },
  {
    id: 'marathon-player',
    icon: Trophy,
    unlocked: false,
    progress: 80,
    category: 'game',
    titles: {
      en: 'Marathon Player',
      zh: '马拉松选手',
      ja: 'マラソンプレイヤー',
    },
    descriptions: {
      en: 'Play 50 training games.',
      zh: '完成 50 局训练游戏。',
      ja: '50回のトレーニングゲームをプレイする。',
    },
  },
  {
    id: 'dimension-master',
    icon: Award,
    unlocked: false,
    progress: 40,
    category: 'game',
    titles: {
      en: 'Dimension Master',
      zh: '维度大师',
      ja: '次元マスター',
    },
    descriptions: {
      en: 'Play games in all five dimensions.',
      zh: '在全部五个维度中各玩一局。',
      ja: '5つの次元すべてでゲームをプレイする。',
    },
  },
  {
    id: 'century-club',
    icon: Medal,
    unlocked: true,
    progress: 100,
    category: 'game',
    titles: {
      en: 'Century Club',
      zh: '百分俱乐部',
      ja: 'センチュリークラブ',
    },
    descriptions: {
      en: 'Score 100 or more in any game.',
      zh: '在任意游戏中获得 100 分以上。',
      ja: '任意のゲームで100点以上を獲得する。',
    },
  },
  {
    id: 'flawless-victory',
    icon: Trophy,
    unlocked: false,
    progress: 20,
    category: 'game',
    titles: {
      en: 'Flawless Victory',
      zh: '完美胜利',
      ja: '完璧な勝利',
    },
    descriptions: {
      en: 'Win a game without a single mistake.',
      zh: '无误完成一局游戏。',
      ja: 'ミスなしでゲームに勝利する。',
    },
  },
  {
    id: 'comeback-king',
    icon: Award,
    unlocked: false,
    progress: 0,
    category: 'game',
    titles: {
      en: 'Comeback King',
      zh: '逆转之王',
      ja: 'カムバックキング',
    },
    descriptions: {
      en: 'Win after a losing streak.',
      zh: '在连败后获胜。',
      ja: '連敗後に勝利する。',
    },
  },
  // Streak Achievements (6)
  {
    id: 'streak-3',
    icon: Flame,
    unlocked: true,
    progress: 100,
    category: 'streak',
    titles: { en: '3-Day Streak', zh: '连续 3 天', ja: '3日連続' },
    descriptions: {
      en: 'Train three days in a row.',
      zh: '连续三天进行训练。',
      ja: '3日連続でトレーニングする。',
    },
  },
  {
    id: 'streak-7',
    icon: Flame,
    unlocked: true,
    progress: 100,
    category: 'streak',
    titles: { en: '7-Day Streak', zh: '连续 7 天', ja: '7日連続' },
    descriptions: {
      en: 'Train seven days in a row.',
      zh: '连续七天进行训练。',
      ja: '7日連続でトレーニングする。',
    },
  },
  {
    id: 'streak-30',
    icon: Medal,
    unlocked: false,
    progress: 40,
    category: 'streak',
    titles: {
      en: '30-Day Streak',
      zh: '连续 30 天',
      ja: '30日連続',
    },
    descriptions: {
      en: 'Train thirty days in a row.',
      zh: '连续三十天进行训练。',
      ja: '30日連続でトレーニングする。',
    },
  },
  {
    id: 'streak-100',
    icon: Trophy,
    unlocked: false,
    progress: 12,
    category: 'streak',
    titles: {
      en: '100-Day Streak',
      zh: '连续 100 天',
      ja: '100日連続',
    },
    descriptions: {
      en: 'Train one hundred days in a row.',
      zh: '连续一百天进行训练。',
      ja: '100日連続でトレーニングする。',
    },
  },
  {
    id: 'year-excellence',
    icon: Award,
    unlocked: false,
    progress: 0,
    category: 'streak',
    titles: {
      en: 'Year of Excellence',
      zh: '卓越之年',
      ja: 'エクセレントの年',
    },
    descriptions: {
      en: 'Train every day for a year.',
      zh: '全年每天都进行训练。',
      ja: '1年間毎日トレーニングする。',
    },
  },
  {
    id: 'unbreakable',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    category: 'streak',
    titles: {
      en: 'Unbreakable',
      zh: '不可破坏',
      ja: 'アンブレイカブル',
    },
    descriptions: {
      en: 'Maintain a streak for 365 days.',
      zh: '保持 365 天连续打卡。',
      ja: '365日間の連続日数を維持する。',
    },
  },
  // Dimension Mastery (10)
  {
    id: 'memory-novice',
    icon: Brain,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'memory',
    titles: {
      en: 'Memory Novice',
      zh: '记忆新手',
      ja: 'メモリー初心者',
    },
    descriptions: {
      en: 'Score 60+ in any memory game.',
      zh: '在任意记忆游戏中获得 60 分以上。',
      ja: '任意のメモリーゲームで60点以上を獲得する。',
    },
  },
  {
    id: 'memory-expert',
    icon: Brain,
    unlocked: false,
    progress: 70,
    category: 'dimension',
    dimension: 'memory',
    titles: {
      en: 'Memory Expert',
      zh: '记忆专家',
      ja: 'メモリーエキスパート',
    },
    descriptions: {
      en: 'Score 90+ in any memory game.',
      zh: '在任意记忆游戏中获得 90 分以上。',
      ja: '任意のメモリーゲームで90点以上を獲得する。',
    },
  },
  {
    id: 'attention-adept',
    icon: Focus,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'attention',
    titles: {
      en: 'Attention Adept',
      zh: '注意能手',
      ja: 'アテンション熟練',
    },
    descriptions: {
      en: 'Score 60+ in any attention game.',
      zh: '在任意注意力游戏中获得 60 分以上。',
      ja: '任意のアテンションゲームで60点以上を獲得する。',
    },
  },
  {
    id: 'attention-master',
    icon: Focus,
    unlocked: false,
    progress: 50,
    category: 'dimension',
    dimension: 'attention',
    titles: {
      en: 'Attention Master',
      zh: '注意大师',
      ja: 'アテンションマスター',
    },
    descriptions: {
      en: 'Score 90+ in any attention game.',
      zh: '在任意注意力游戏中获得 90 分以上。',
      ja: '任意のアテンションゲームで90点以上を獲得する。',
    },
  },
  {
    id: 'reaction-rookie',
    icon: Zap,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'reaction',
    titles: {
      en: 'Reaction Rookie',
      zh: '反应新手',
      ja: 'リアクション初心者',
    },
    descriptions: {
      en: 'Score 60+ in any reaction game.',
      zh: '在任意反应游戏中获得 60 分以上。',
      ja: '任意のリアクションゲームで60点以上を獲得する。',
    },
  },
  {
    id: 'reaction-pro',
    icon: Zap,
    unlocked: false,
    progress: 30,
    category: 'dimension',
    dimension: 'reaction',
    titles: {
      en: 'Reaction Pro',
      zh: '反应专家',
      ja: 'リアクションプロ',
    },
    descriptions: {
      en: 'Score 90+ in any reaction game.',
      zh: '在任意反应游戏中获得 90 分以上。',
      ja: '任意のリアクションゲームで90点以上を獲得する。',
    },
  },
  {
    id: 'executive-apprentice',
    icon: Layers,
    unlocked: false,
    progress: 60,
    category: 'dimension',
    dimension: 'executive',
    titles: {
      en: 'Executive Apprentice',
      zh: '执行学徒',
      ja: 'エグゼクティブ見習い',
    },
    descriptions: {
      en: 'Score 60+ in any executive game.',
      zh: '在任意执行功能游戏中获得 60 分以上。',
      ja: '任意のエグゼクティブゲームで60点以上を獲得する。',
    },
  },
  {
    id: 'executive-expert',
    icon: Layers,
    unlocked: false,
    progress: 10,
    category: 'dimension',
    dimension: 'executive',
    titles: {
      en: 'Executive Expert',
      zh: '执行专家',
      ja: 'エグゼクティブエキスパート',
    },
    descriptions: {
      en: 'Score 90+ in any executive game.',
      zh: '在任意执行功能游戏中获得 90 分以上。',
      ja: '任意のエグゼクティブゲームで90点以上を獲得する。',
    },
  },
  {
    id: 'relaxation-seeker',
    icon: Wind,
    unlocked: false,
    progress: 40,
    category: 'dimension',
    dimension: 'relaxation',
    titles: {
      en: 'Relaxation Seeker',
      zh: '放松探索者',
      ja: 'リラクゼーション探索者',
    },
    descriptions: {
      en: 'Score 60+ in any relaxation game.',
      zh: '在任意放松游戏中获得 60 分以上。',
      ja: '任意のリラクゼーションゲームで60点以上を獲得する。',
    },
  },
  {
    id: 'relaxation-sage',
    icon: Wind,
    unlocked: false,
    progress: 20,
    category: 'dimension',
    dimension: 'relaxation',
    titles: {
      en: 'Relaxation Sage',
      zh: '放松智者',
      ja: 'リラクゼーション賢者',
    },
    descriptions: {
      en: 'Score 90+ in any relaxation game.',
      zh: '在任意放松游戏中获得 90 分以上。',
      ja: '任意のリラクゼーションゲームで90点以上を獲得する。',
    },
  },
]

const DIMENSION_STYLES: Record<
  GameDimension,
  { bg: string; text: string }
> = {
  memory: { bg: 'bg-dim-memory/15', text: 'text-dim-memory-text' },
  attention: { bg: 'bg-dim-attention/15', text: 'text-dim-attention-text' },
  reaction: { bg: 'bg-dim-reaction/15', text: 'text-dim-reaction-text' },
  executive: { bg: 'bg-dim-executive/15', text: 'text-dim-executive-text' },
  relaxation: { bg: 'bg-dim-relaxation/15', text: 'text-dim-relaxation-text' },
}

type AchievementStyle = {
  cardTint: string
  iconColor: string
  iconBg: string
}

function getAchievementStyle(ach: Achievement): AchievementStyle {
  if (!ach.unlocked) {
    return {
      cardTint: 'bg-background-secondary',
      iconColor: 'text-text-muted',
      iconBg: 'bg-border',
    }
  }
  if (ach.dimension) {
    const styles = DIMENSION_STYLES[ach.dimension]
    return {
      cardTint: styles.bg,
      iconColor: styles.text,
      iconBg: 'bg-card',
    }
  }
  return {
    cardTint: 'bg-primary-light',
    iconColor: 'text-primary',
    iconBg: 'bg-card',
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = TEXTS[locale]
  const pathPrefix = `/${locale}/achievements`

  return {
    title: texts.title,
    description: texts.subtitle,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/achievements',
        zh: '/zh/achievements',
        ja: '/ja/achievements',
        'x-default': '/en/achievements',
      },
    },
    openGraph: {
      title: texts.title,
      description: texts.subtitle,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function AchievementsPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = TEXTS[locale]

  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length
  const progressPercent = Math.round(
    (unlockedCount / totalAchievements) * 100
  )

  const stats: ReadonlyArray<{
    icon: LucideIcon
    value: string
    label: string
    accent: string
  }> = [
    {
      icon: Trophy,
      value: String(totalAchievements),
      label: texts.statTotalLabel,
      accent: 'bg-primary-light',
    },
    {
      icon: Award,
      value: String(unlockedCount),
      label: texts.statUnlockedLabel,
      accent: 'bg-accent-light',
    },
    {
      icon: Medal,
      value: `${progressPercent}%`,
      label: texts.statProgressLabel,
      accent: 'bg-secondary-light',
    },
  ]

  const categories: ReadonlyArray<{
    key: AchievementCategory
    title: string
    subtitle: string
  }> = [
    {
      key: 'game',
      title: texts.gameCategoryTitle,
      subtitle: texts.gameCategorySubtitle,
    },
    {
      key: 'streak',
      title: texts.streakCategoryTitle,
      subtitle: texts.streakCategorySubtitle,
    },
    {
      key: 'dimension',
      title: texts.dimensionCategoryTitle,
      subtitle: texts.dimensionCategorySubtitle,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
        <div className="mx-auto max-w-5xl">
          <Badge variant="info" className="mb-md w-fit">
            {texts.demoBadge}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {texts.title}
          </h1>
          <p className="text-md text-text-secondary max-w-2xl">
            {texts.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xl">
            {texts.statsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="border-primary-light">
                  <CardContent className="flex items-center gap-md p-lg">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${stat.accent}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {stat.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Achievement Categories */}
      {categories.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category.key)
        return (
          <section
            key={category.key}
            className={
              category.key === 'streak'
                ? 'bg-background-secondary px-md py-3xl'
                : 'px-md py-3xl'
            }
          >
            <div className="mx-auto max-w-5xl">
              <div className="mb-xl">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xs">
                  {category.title}
                </h2>
                <p className="text-sm text-text-secondary max-w-2xl">
                  {category.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {items.map((ach) => {
                  const Icon = ach.icon
                  const style = getAchievementStyle(ach)
                  return (
                    <Card
                      key={ach.id}
                      className={`border-primary-light flex flex-col ${ach.unlocked ? '' : 'opacity-75'}`}
                    >
                      <CardContent
                        className={`flex flex-1 flex-col items-center gap-md p-lg text-center ${style.cardTint}`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg}`}
                        >
                          <Icon className={`h-6 w-6 ${style.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {ach.titles[locale]}
                        </span>
                        <span className="text-xs text-text-secondary flex-1">
                          {ach.descriptions[locale]}
                        </span>
                        <Badge
                          variant={ach.unlocked ? 'success' : 'info'}
                          className="w-fit"
                        >
                          {ach.unlocked ? texts.unlockedLabel : texts.lockedLabel}
                        </Badge>
                        {!ach.unlocked && (
                          <div className="flex w-full flex-col gap-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-muted">
                                {texts.progressLabel}
                              </span>
                              <span className="text-xs font-semibold text-text-secondary">
                                {ach.progress}%
                              </span>
                            </div>
                            <Progress
                              value={ach.progress}
                              dimension={ach.dimension ?? null}
                              aria-label={`${ach.titles[locale]} ${texts.progressLabel}`}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="bg-gradient-hero px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {texts.ctaTitle}
          </h2>
          <p className="text-md text-text-secondary mb-2xl max-w-xl mx-auto">
            {texts.ctaSubtitle}
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/games`}>
              {texts.ctaButton}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
