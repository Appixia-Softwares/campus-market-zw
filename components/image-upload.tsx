"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  onRemove: (url: string) => void
  productId?: string
}

export function ImageUpload({ value, onChange, onRemove, productId }: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      if (error) {
        console.error('Auth check error:', error)
      }
    }
    checkAuth()
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log('Files dropped:', acceptedFiles)

      if (!isAuthenticated) {
        console.log('User not authenticated')
        toast({
          title: "Authentication required",
          description: "Please sign in to upload images",
          variant: "destructive",
        })
        return
      }

      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('Auth error:', authError)
          toast({
            title: "Authentication Error",
            description: "Failed to verify authentication. Please try again.",
            variant: "destructive",
          })
          return
        }
        
        if (!user) {
          console.log('No user found')
          toast({
            title: "Authentication required",
            description: "Please sign in to upload images",
            variant: "destructive",
          })
          return
        }

        console.log('User authenticated:', user.id)

        if (value.length + acceptedFiles.length > 5) {
          toast({
            title: "Too many images",
            description: "You can upload a maximum of 5 images",
            variant: "destructive",
          })
          return
        }

        setIsUploading(true)
        console.log('Starting upload process')

        for (const file of acceptedFiles) {
          console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)

          // Initialize progress for this file
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

          // Validate file type
          if (!file.type.startsWith('image/')) {
            console.log('Invalid file type:', file.type)
            toast({
              title: "Invalid file type",
              description: "Please upload only image files (PNG, JPG, JPEG, GIF)",
              variant: "destructive",
            })
            continue
          }

          // Validate file size (5MB)
          if (file.size > 5 * 1024 * 1024) {
            console.log('File too large:', file.size)
            toast({
              title: "File too large",
              description: "Image must be less than 5MB",
              variant: "destructive",
            })
            continue
          }

          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          console.log('Generated filename:', fileName)

          try {
            // Upload the file to storage
            console.log('Attempting to upload to storage bucket: product-images')
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false
              })

            if (uploadError) {
              console.error('Upload error:', uploadError)
              toast({
                title: "Upload Error",
                description: `Failed to upload image: ${uploadError.message}`,
                variant: "destructive",
              })
              continue
            }

            console.log('File uploaded successfully:', uploadData)

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName)

            console.log('Generated public URL:', publicUrl)

            // If we have a product ID, create a record in the product_images table
            if (productId) {
              console.log('Creating product image record for product:', productId)
              const { error: insertError } = await supabase
                .from('product_images')
                .insert({
                  product_id: productId,
                  url: publicUrl,
                  alt_text: file.name,
                  is_primary: value.length === 0,
                  sort_order: value.length
                })

              if (insertError) {
                console.error('Error creating product image record:', insertError)
                await supabase.storage.from("product-images").remove([fileName])
                toast({
                  title: "Error",
                  description: "Failed to save image details. Please try again.",
                  variant: "destructive",
                })
                continue
              }
            }

            // Update the form with the new image URL
            onChange([...value, publicUrl])
            console.log('Image added to form')

            // Show success message
            toast({
              title: "Success",
              description: "Image uploaded successfully",
              variant: "default",
            })

            // Set progress to 100%
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))

          } catch (error) {
            console.error('Error in upload process:', error)
            toast({
              title: "Error",
              description: "An unexpected error occurred during upload. Please try again.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error('Error in onDrop:', error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        // Clear progress after a delay
        setTimeout(() => {
          setUploadProgress({})
        }, 1000)
      }
    },
    [value, onChange, toast, productId, isAuthenticated]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: isUploading || !isAuthenticated
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
          isDragActive && "border-primary bg-primary/5 scale-105",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && !isDragReject && "border-muted-foreground/25 hover:border-primary/50",
          (isUploading || !isAuthenticated) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : !isAuthenticated ? (
            <div className="text-destructive">Please sign in to upload images</div>
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {isUploading ? (
              "Uploading..."
            ) : !isAuthenticated ? (
              "Sign in to upload images"
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or JPEG (MAX. 5MB)
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={url} className="relative group aspect-square">
              <div className="relative w-full h-full">
                <Image
                  src={url}
                  alt="Product image"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(url)
                }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress Indicators */}
      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate">{fileName}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
} 