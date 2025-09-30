import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Locale, getTranslations } from '@/app/i18n'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const t = getTranslations(locale)

  const footerSections = [
    {
      title: locale === 'tr' ? 'Kurumsal' : 'Corporate',
      links: [
        { label: locale === 'tr' ? 'Hakkımızda' : 'About Us', href: `/${locale}/about` },
        { label: locale === 'tr' ? 'İletişim' : 'Contact', href: `/${locale}/contact` },
        { label: locale === 'tr' ? 'Kariyer' : 'Careers', href: `/${locale}/careers` },
        { label: 'Blog', href: `/${locale}/blog` },
      ],
    },
    {
      title: locale === 'tr' ? 'Müşteri Hizmetleri' : 'Customer Service',
      links: [
        { label: locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ', href: `/${locale}/faq` },
        { label: locale === 'tr' ? 'Kargo ve Teslimat' : 'Shipping & Delivery', href: `/${locale}/shipping` },
        { label: locale === 'tr' ? 'İade ve Değişim' : 'Returns & Exchanges', href: `/${locale}/returns` },
        { label: locale === 'tr' ? 'Güvenli Alışveriş' : 'Secure Shopping', href: `/${locale}/security` },
      ],
    },
    {
      title: locale === 'tr' ? 'Kategoriler' : 'Categories',
      links: [
        { label: t.navigation.electronics, href: `/${locale}/products?category=electronics` },
        { label: t.navigation.jewelry, href: `/${locale}/products?category=jewelery` },
        { label: t.navigation.menClothing, href: `/${locale}/products?category=men's clothing` },
        { label: t.navigation.womenClothing, href: `/${locale}/products?category=women's clothing` },
      ],
    },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">Mini E-Commerce</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              {locale === 'tr' 
                ? 'Modern alışveriş deneyimi için güvenilir adresiniz. En kaliteli ürünler, en uygun fiyatlar.'
                : 'Your reliable address for modern shopping experience. Best quality products, best prices.'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>{locale === 'tr' ? '0850 123 45 67' : '0850 123 45 67'}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{locale === 'tr' ? 'destek@miniecommerce.com' : 'destek@miniecommerce.com'}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{locale === 'tr' ? 'İstanbul, Türkiye' : 'Istanbul, Türkiye'}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Mini E-Commerce. {t.footer.allRightsReserved}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {t.footer.privacy}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}