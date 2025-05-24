"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Upload, X, Check, Package, FileText, Camera, DollarSign, Eye } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const STEPS = [
  { id: 1, title: "Basic Info", icon: Package, description: "Product title and category" },
  { id: 2, title: "Description", icon: FileText, description: "Detailed description" },
  { id: 3, title: "Photos", icon: Camera, description: "Upload product images" },
  { id: 4, title: "Pricing", icon: DollarSign, description: "Set your price" },
  { id: 5, title: "Review", icon: Eye, description: "Review and publish" },
]

const CONDITIONS = [
  { value: "New", label: "New", description: "Brand new, never used" },
  { value: "Like New", label: "Like New", description: "Barely used, excellent condition" },
  { value: "Good", label: "Good", description: "Used but in good condition" },
  { value: "Fair", label: "Fair", description: "Shows wear but still functional" },
  { value: "Poor", label: "Poor", description: "Heavy wear, may need repairs" },
]

export default function NewListingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    condition: "",
    description: "",
    price: "",
    brand: "",
    model: "",
  })

  const supabase = createClientComponentClient<Database>()

  // Fetch categories on mount
  useState(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("product_categories").select("*").order("name")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed")
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category_id && formData.condition
      case 2:
        return formData.description.length >= 20
      case 3:
        return images.length > 0
      case 4:
        return formData.price && Number.parseFloat(formData.price) > 0
      default:
        return true
    }
  }

  const submitListing = async () => {
    if (!user) {
      toast.error("Please log in to create a listing")
      return
    }

    setLoading(true)

    try {
      // Create product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category_id: formData.category_id,
          condition: formData.condition as any,
          seller_id: user.id,
          brand: formData.brand || null,
          model: formData.model || null,
          status: "active",
        })
        .select()
        .single()

      if (productError) throw productError

      // Upload images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileName = `${product.id}/${Date.now()}-${i}.${file.name.split(".").pop()}`

          const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file)

          if (uploadError) throw uploadError

          const {
            data: { publicUrl },
          } = supabase.storage.from("product-images").getPublicUrl(fileName)

          await supabase.from("product_images").insert({
            product_id: product.id,
            url: publicUrl,
            is_primary: i === 0,
            sort_order: i,
          })
        }
      }

      toast.success("Product listed successfully!")
      router.push(`/marketplace/products/${product.id}`)
    } catch (error) {
      console.error("Error creating listing:", error)
      toast.error("Failed to create listing")
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">List Your Product</h1>
          <p className="text-muted-foreground">Create a listing to sell your item</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="mb-6" />

        {/* Step indicators */}
        <div className="flex justify-between">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary/10 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }
                `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 13 Pro Max 256GB"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific and descriptive. Include brand, model, and key features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div>
                            <div className="font-medium">{condition.label}</div>
                            <div className="text-xs text-muted-foreground">{condition.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Apple, Samsung"
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model (Optional)</Label>
                  <Input
                    id="model"
                    placeholder="e.g., iPhone 13 Pro Max"
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail. Include features, condition, reason for selling, etc."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={8}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Minimum 20 characters required</span>
                  <span>{formData.description.length} characters</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">💡 Tips for a great description:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mention any defects or wear honestly</li>
                  <li>• Include original accessories or packaging</li>
                  <li>• Explain why you're selling</li>
                  <li>• Add purchase date if recent</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Product Photos * (Max 8)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload Photos</p>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to select images</p>
                  </label>
                </div>
              </div>

              {images.length > 0 && (
                <div>
                  <Label>Uploaded Images ({images.length}/8)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && <Badge className="absolute bottom-2 left-2">Primary</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📸 Photo tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use good lighting and clear focus</li>
                  <li>• Show the item from multiple angles</li>
                  <li>• Include close-ups of any defects</li>
                  <li>• First photo will be the main image</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">💰 Pricing tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Research similar items to price competitively</li>
                  <li>• Consider the item's age and condition</li>
                  <li>• Leave room for negotiation</li>
                  <li>• Be realistic about depreciation</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Review Your Listing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Title:</span> {formData.title}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        {categories.find((c) => c.id === formData.category_id)?.name}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Condition:</span> {formData.condition}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span> ${formData.price}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Images</h4>
                    <div className="flex gap-2">
                      {images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                      {images.length > 3 && (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs">
                          +{images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{formData.description}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📋 Before you publish:</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ All information is accurate</li>
                  <li>✓ Photos clearly show the item</li>
                  <li>✓ Price is competitive</li>
                  <li>✓ Description is honest and detailed</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={submitListing} disabled={loading || !canProceed()}>
            {loading ? "Publishing..." : "Publish Listing"}
          </Button>
        )}
      </div>
    </div>
  )
}
