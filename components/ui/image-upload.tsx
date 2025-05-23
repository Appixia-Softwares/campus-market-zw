"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onChange: (files: File[]) => void
  value?: File[]
  multiple?: boolean
  maxFiles?: number
  className?: string
}

export function ImageUpload({ onChange, value = [], multiple = false, maxFiles = 5, className }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)
    const newFiles = [...value]
    const newPreviews = [...previews]

    selectedFiles.forEach((file) => {
      if (newFiles.length < maxFiles) {
        newFiles.push(file)
        const preview = URL.createObjectURL(file)
        newPreviews.push(preview)
      }
    })

    onChange(newFiles)
    setPreviews(newPreviews)

    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newFiles = [...value]
    const newPreviews = [...previews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    onChange(newFiles)
    setPreviews(newPreviews)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <Card key={index} className="relative aspect-square overflow-hidden">
            <img
              src={preview || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}

        {value.length < maxFiles && (
          <Card
            className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleButtonClick}
          >
            <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Upload Image</p>
          </Card>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground mt-2">
        {value.length} of {maxFiles} images uploaded
      </p>
    </div>
  )
}
