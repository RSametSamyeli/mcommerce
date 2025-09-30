'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ImageGalleryProps {
  image: string
  title: string
  discount?: number
  isNew?: boolean
}

export function ImageGallery({ image, title, discount, isNew }: ImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="relative">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-8 transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && (
            <Badge variant="destructive">
              {discount}% İndirim
            </Badge>
          )}
          {isNew && (
            <Badge variant="secondary">
              Yeni
            </Badge>
          )}
        </div>

        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative w-full h-[70vh]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setIsZoomed(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}