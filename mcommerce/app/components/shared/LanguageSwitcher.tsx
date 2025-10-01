'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { Locale, locales } from '@/app/i18n'

interface LanguageSwitcherProps {
  currentLocale: Locale
  showText?: boolean
}

export function LanguageSwitcher({ currentLocale, showText = false }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
    
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    
    router.push(`/${newLocale}${pathnameWithoutLocale}`)
  }

  const languages = {
    tr: { name: 'Türkçe', flag: '🇹🇷' },
    en: { name: 'English', flag: '🇺🇸' },
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={showText ? "sm" : "icon"} 
          className={showText ? "h-9 px-3" : "h-9 w-9"}
        >
          <Globe className="h-4 w-4" />
          {showText && (
            <span className="ml-2 text-sm font-medium">
              {languages[currentLocale].name}
            </span>
          )}
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
          >
            <span className="mr-2">{languages[locale].flag}</span>
            {languages[locale].name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}