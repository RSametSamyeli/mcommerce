'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Locale, getTranslations } from '@/app/i18n'

export default function NotFound() {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'
  const t = getTranslations(locale)

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{t.errors.notFound}</h1>
            <p className="text-muted-foreground">
              {t.errors.notFoundDescription}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild className="flex-1">
              <Link href={`/${locale}`}>
                <Home className="h-4 w-4 mr-2" />
                {t.errors.goHome}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/${locale}/products`}>
                <Search className="h-4 w-4 mr-2" />
                {t.cart.browseProducts}
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}