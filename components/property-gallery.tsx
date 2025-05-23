"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullGallery, setShowFullGallery] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      {/* Main image display */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Property image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 bg-background/80 hover:bg-background"
          onClick={() => setShowFullGallery(true)}
        >
          <Expand className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full ${index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-background/80"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail preview */}
      <div className="hidden md:grid grid-cols-4 gap-2 mt-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-video rounded-md overflow-hidden ${index === currentIndex ? "ring-2 ring-primary" : ""}`}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Property thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Full gallery modal */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-semibold">Property Gallery</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFullGallery(false)}>
              Close
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <img
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Property image ${currentIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex justify-center gap-2 overflow-x-auto py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`h-16 w-24 flex-shrink-0 rounded-md overflow-hidden ${
                    index === currentIndex ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
