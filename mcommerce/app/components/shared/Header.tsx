'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, ChevronDown, Smartphone, Gem, ShirtIcon, Shirt } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/app/store/cart'
import { CartDrawer } from '../cart/CartDrawer'
import { useHydration } from '@/app/hooks/useHydration'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Locale, getTranslations } from '@/app/i18n'

interface HeaderProps {
  locale: Locale
}

export function Header({ locale }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const router = useRouter()
  const { totalItems } = useCartStore()
  const isHydrated = useHydration()
  const t = getTranslations(locale)
  
  const displayTotalItems = isHydrated ? totalItems : 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const categoryLinks = [
    { href: `/${locale}/products?category=electronics`, label: t.categories.electronics, icon: Smartphone },
    { href: `/${locale}/products?category=jewelery`, label: t.categories.jewelery, icon: Gem },
    { href: `/${locale}/products?category=mens-clothing`, label: t.categories.mensClothing, icon: ShirtIcon },
    { href: `/${locale}/products?category=womens-clothing`, label: t.categories.womensClothing, icon: Shirt },
  ]

  const mainLinks = [
    { href: `/${locale}/products`, label: t.common.products }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center">
          
          <div className="flex items-center space-x-6">
            <Link 
              href={`/${locale}`} 
              className="flex items-center space-x-2 shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Ana sayfa"
            >
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                M-Commerce
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Ana navigasyon">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-sm font-medium">
                    {locale === 'tr' ? 'Kategoriler' : 'Categories'}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {categoryLinks.map((link) => {
                    const IconComponent = link.icon
                    return (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex items-center space-x-3 w-full px-3 py-2"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{link.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex-1 flex justify-center px-8">
            <form 
              onSubmit={handleSearch} 
              className="hidden md:flex w-full max-w-lg"
              role="search"
              aria-label="Ürün arama"
            >
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder={t.common.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-4 pr-10 transition-all ${
                    isSearchFocused ? 'ring-2 ring-primary/20 border-primary/50' : ''
                  }`}
                  aria-label="Ürün ara"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-primary/10"
                  aria-label="Ara"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="hidden sm:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            
            <CartDrawer locale={locale}>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent transition-colors"
                aria-label={`Sepet ${displayTotalItems > 0 ? `- ${displayTotalItems} ürün` : '- boş'}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {displayTotalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {displayTotalItems > 99 ? '99+' : displayTotalItems}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Menüyü aç"
                  className="hover:bg-accent transition-colors"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="text-left border-b pb-4">
                  <SheetTitle className="text-lg font-semibold">{t.common.menu}</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="md:hidden">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Input
                          type="search"
                          placeholder={t.common.searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-4 pr-10"
                          aria-label="Ürün ara"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3"
                          aria-label="Ara"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </div>

                  <nav className="space-y-1" role="navigation" aria-label="Mobil navigasyon">
                    {mainLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {locale === 'tr' ? 'Kategoriler' : 'Categories'}
                      </p>
                      {categoryLinks.map((link) => {
                        const IconComponent = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span>{link.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  <div className="sm:hidden pt-4 border-t">
                    <LanguageSwitcher currentLocale={locale} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}