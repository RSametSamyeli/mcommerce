'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getCategories } from '@/app/lib/api/products'
import { Category } from '@/app/types'

const UncontrolledSlider = memo(({ 
  defaultValue, 
  onValueCommit 
}: { 
  defaultValue: number[]
  onValueCommit: (value: number[]) => void 
}) => {
  const [value, setValue] = useState(defaultValue)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleChange = (newValue: number[]) => {
    setValue(newValue)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      onValueCommit(newValue)
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Slider
        value={value}
        onValueChange={handleChange}
        max={10000}
        min={0}
        step={100}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>{value[0].toLocaleString('tr-TR')} ₺</span>
        <span>{value[1].toLocaleString('tr-TR')} ₺</span>
      </div>
    </>
  )
})

UncontrolledSlider.displayName = 'UncontrolledSlider'

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const selectedCategories = searchParams.get('category')?.split(',') || []
  const currentMinPrice = Number(searchParams.get('minPrice')) || 0
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || 10000
  const currentSearch = searchParams.get('search') || ''

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    if (key !== 'page') {
      params.set('page', '1')
    }
    
    const newUrl = `${pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      updateURL('search', value)
    }, 300)
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    let newCategories = [...selectedCategories]
    
    if (checked && !newCategories.includes(categorySlug)) {
      newCategories.push(categorySlug)
    } else if (!checked) {
      newCategories = newCategories.filter(cat => cat !== categorySlug)
    }
    
    updateURL('category', newCategories.length > 0 ? newCategories.join(',') : null)
  }

  const handlePriceChange = (value: number[]) => {
    if (value[0] > 0) {
      updateURL('minPrice', value[0].toString())
    } else {
      updateURL('minPrice', null)
    }
    
    if (value[1] < 10000) {
      updateURL('maxPrice', value[1].toString())
    } else {
      updateURL('maxPrice', null)
    }
  }

  const clearAllFilters = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    router.push(pathname)
    setIsOpen(false)
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
                          currentMinPrice > 0 || 
                          currentMaxPrice < 10000 || 
                          currentSearch !== ''

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const FilterContent = memo(() => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Arama</h3>
        <Input
          ref={searchInputRef}
          placeholder="Ürün ara..."
          defaultValue={currentSearch}
          onChange={handleSearchInput}
          type="search"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-3">Kategoriler</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.slug, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category.slug}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Fiyat Aralığı</h3>
        <UncontrolledSlider
          defaultValue={[currentMinPrice, currentMaxPrice]}
          onValueCommit={handlePriceChange}
        />
      </div>

      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  ))

  FilterContent.displayName = 'FilterContent'

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Filtreler</h2>
            {hasActiveFilters && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Aktif
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                {selectedCategories.length + (currentMinPrice > 0 || currentMaxPrice < 10000 ? 1 : 0) + (currentSearch ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Filtreler</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}