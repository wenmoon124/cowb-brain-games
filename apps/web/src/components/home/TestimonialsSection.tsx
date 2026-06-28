'use client'

import { Users, TrendingUp, Award, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'

interface TestimonialsSectionProps {
  locale: Locale
}

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'home.testimonials.testimonial1.name',
    role: 'home.testimonials.testimonial1.role',
    content: 'home.testimonials.testimonial1.content',
    rating: 5,
  },
  {
    name: 'home.testimonials.testimonial2.name',
    role: 'home.testimonials.testimonial2.role',
    content: 'home.testimonials.testimonial2.content',
    rating: 5,
  },
  {
    name: 'home.testimonials.testimonial3.name',
    role: 'home.testimonials.testimonial3.role',
    content: 'home.testimonials.testimonial3.content',
    rating: 5,
  },
]

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const { t } = useTranslation(locale)
  return (
    <section className="px-md py-3xl bg-gradient-to-br from-secondary/5 to-accent/5">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
          <Card className="text-center">
            <CardContent className="pt-xl">
              <div className="flex justify-center mb-md">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-text-primary mb-sm">
                {t('home.testimonials.stats.users')}
              </div>
              <div className="text-sm text-text-secondary">
                {t('home.testimonials.stats.activeUsers')}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-xl">
              <div className="flex justify-center mb-md">
                <div className="p-3 rounded-full bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-text-primary mb-sm">
                {t('home.testimonials.stats.improvement')}
              </div>
              <div className="text-sm text-text-secondary">
                {t('home.testimonials.stats.averageImprovement')}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-xl">
              <div className="flex justify-center mb-md">
                <div className="p-3 rounded-full bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-text-primary mb-sm">
                {t('home.testimonials.stats.games')}
              </div>
              <div className="text-sm text-text-secondary">
                {t('home.testimonials.stats.gamesPlayed')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 用户评价 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-xl">
                {/* 评分星星 */}
                <div className="flex gap-0.5 mb-md">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* 评价内容 */}
                <p className="text-text-secondary mb-lg leading-relaxed">
                  {t(testimonial.content)}
                </p>

                {/* 用户信息 */}
                <div className="flex items-center gap-md">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                      {t(testimonial.name).charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {t(testimonial.name)}
                    </div>
                    <div className="text-sm text-text-muted">
                      {t(testimonial.role)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
