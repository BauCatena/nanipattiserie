"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type ProductGalleryProps = {
  images: string[]
  alt: string
  className?: string
}

export function ProductGallery({ images, alt, className }: ProductGalleryProps) {
  return (
    <div className={cn("relative w-full max-w-xl mx-auto", className)}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={`${src}-${i}`}>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={src}
                  alt={`${alt} — ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 36rem"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 ? (
          <>
            <CarouselPrevious
              className={cn(
                "!left-2 !right-auto top-1/2 -translate-y-1/2",
                "size-9 border-border bg-background/90 shadow-sm"
              )}
            />
            <CarouselNext
              className={cn(
                "!right-2 !left-auto top-1/2 -translate-y-1/2",
                "size-9 border-border bg-background/90 shadow-sm"
              )}
            />
          </>
        ) : null}
      </Carousel>
    </div>
  )
}
