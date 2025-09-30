'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Locale, getTranslations } from '@/app/i18n'

interface ProductSortProps {
  locale: Locale
}

export function ProductSort({ locale }: ProductSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sortBy') || 'newest'
  const t = getTranslations(locale)

  const sortOptions = [
    { value: 'newest', label: t.products.sortOptions.newest },
    { value: 'popularity', label: t.products.sortOptions.popularity },
    { value: 'price-asc', label: t.products.sortOptions.priceLowToHigh },
    { value: 'price-desc', label: t.products.sortOptions.priceHighToLow },
    { value: 'name-asc', label: t.products.sortOptions.nameAsc },
    { value: 'name-desc', label: t.products.sortOptions.nameDesc },
  ]

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    params.set('page', '1')
    const newUrl = `${pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{t.products.sortBy}:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}