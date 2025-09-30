import { Locale, getTranslations } from '@/app/i18n'
import Link from 'next/link'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = getTranslations(locale)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t.metadata.siteTitle}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t.metadata.siteDescription}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {t.common.products}
        </Link>
      </div>
    </div>
  )
}