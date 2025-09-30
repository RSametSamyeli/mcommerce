import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Header } from '@/app/components/shared/Header'
import { Footer } from '@/app/components/shared/Footer'
import { Locale, locales, getTranslations } from '@/app/i18n'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getTranslations(locale as Locale)

  return {
    title: {
      default: t.metadata.siteTitle,
      template: '%s | Mini E-Commerce',
    },
    description: t.metadata.siteDescription,
    keywords: ['e-ticaret', 'online alışveriş', 'ürünler', 'katalog'],
    authors: [{ name: 'Mini E-Commerce' }],
    creator: 'Mini E-Commerce',
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Mini E-Commerce',
      title: t.metadata.siteTitle,
      description: t.metadata.siteDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mini E-Commerce',
      description: t.metadata.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'tr': '/tr',
        'en': '/en',
      },
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header locale={locale as Locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale as Locale} />
        </div>
      </body>
    </html>
  )
}