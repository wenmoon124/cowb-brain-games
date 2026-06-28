import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, FileText, Shield } from 'lucide-react'
import Link from 'next/link'

interface AboutSectionProps {
  locale: string
}

export function AboutSection({ locale }: AboutSectionProps) {
  return (
    <div className="space-y-6">
      {/* Version Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About CowB.cc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Build</p>
              <p className="font-medium">2024.01.01</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-text-secondary">
              CowB.cc is a science-based brain training platform designed to help you
              improve cognitive abilities through engaging games and exercises.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card>
        <CardHeader>
          <CardTitle>Legal & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link
            href={`/${locale}/privacy`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Privacy Policy</p>
              <p className="text-sm text-text-muted">
                Learn how we protect and handle your data
              </p>
            </div>
          </Link>

          <Link
            href={`/${locale}/terms`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Terms of Service</p>
              <p className="text-sm text-text-muted">
                Review our terms and conditions
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-2">
            Have questions or need support? We&apos;re here to help.
          </p>
          <a
            href="mailto:wenmoon124@gmail.com"
            className="text-primary hover:underline"
          >
            wenmoon124@gmail.com
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
