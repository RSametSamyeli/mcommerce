import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/app/components/shared/Header'
import { Footer } from '@/app/components/shared/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Mini E-Commerce - Modern Alışveriş Deneyimi',
    template: '%s | Mini E-Commerce',
  },
  description: 'En yeni ürünler, en iyi fiyatlar. Modern e-ticaret deneyimi.',
  keywords: ['e-ticaret', 'online alışveriş', 'ürünler', 'katalog'],
  authors: [{ name: 'Mini E-Commerce' }],
  creator: 'Mini E-Commerce',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Mini E-Commerce',
    title: 'Mini E-Commerce - Modern Alışveriş Deneyimi',
    description: 'En yeni ürünler, en iyi fiyatlar. Modern e-ticaret deneyimi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini E-Commerce',
    description: 'En yeni ürünler, en iyi fiyatlar. Modern e-ticaret deneyimi.',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
