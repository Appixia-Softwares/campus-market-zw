"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setIsLoading(false)
        setError(true)
      }}
      {...props}
    />
  )
}

// Add default export
export default OptimizedImage
