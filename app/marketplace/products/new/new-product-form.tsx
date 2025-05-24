"use client"

import React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getProductCategories } from "@/lib/api/products"
import { ChevronLeft, ChevronRight, Package, Camera, FileText, DollarSign, CheckCircle } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().min(1, "Price is required"),
  category_id: z.string({ required_error: "Please select a category" }),
  condition: z.enum(["New", "Like New", "Good", "Fair", "Poor"]),
  images: z.array(z.any()).min(1, "At least one image is required").max(8, "Maximum 8 images allowed"),
})

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about your item",
    icon: Package,
    fields: ["title", "category_id", "condition"],
  },
  {
    id: 2,
    title: "Description & Details",
    description: "Provide detailed information",
    icon: FileText,
    fields: ["description"],
  },
  {
    id: 3,
    title: "Photos",
    description: "Add photos of your item",
    icon: Camera,
    fields: ["images"],
  },
  {
    id: 4,
    title: "Pricing",
    description: "Set your price",
    icon: DollarSign,
    fields: ["price"],
  },
  {
    id: 5,
    title: "Review & Publish",
    description: "Review your listing",
    icon: CheckCircle,
    fields: [],
  },
]

export function NewProductForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      condition: "Good",
      images: [],
    },
  })

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await getProductCategories()
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const progress = (currentStep / steps.length) * 100

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields
    if (currentStepFields.length === 0) return true

    const result = await form.trigger(currentStepFields as any)
    return result
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a listing",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement product creation
      console.log("Creating product:", values)

      toast({
        title: "Product listed successfully!",
        description: "Your item is now live on the marketplace",
      })

      router.push("/marketplace")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. iPhone 13 Pro Max 256GB" {...field} />
                  </FormControl>
                  <FormDescription>Be specific and descriptive to attract more buyers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Be honest about the condition to build trust with buyers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail. Include any defects, accessories included, reason for selling, etc."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide detailed information to help buyers make informed decisions</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-medium mb-2">💡 Tips for a great description:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mention the brand, model, and specifications</li>
                <li>• Include any accessories or original packaging</li>
                <li>• Be honest about any wear or defects</li>
                <li>• Explain why you're selling</li>
                <li>• Add your preferred pickup/delivery method</li>
              </ul>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Photos</FormLabel>
                  <FormDescription>
                    Add up to 8 high-quality photos. The first photo will be your main image.
                  </FormDescription>
                  <FormControl>
                    <ImageUpload onChange={field.onChange} value={field.value} multiple maxFiles={8} className="mt-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
              <h4 className="font-medium mb-2">📸 Photo tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use good lighting (natural light works best)</li>
                <li>• Show the item from multiple angles</li>
                <li>• Include close-ups of any defects or wear</li>
                <li>• Keep backgrounds clean and uncluttered</li>
                <li>• Show the item in use if applicable</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="0.00" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Set a competitive price. You can always negotiate with buyers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-medium mb-2">💰 Pricing tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Research similar items on the platform</li>
                <li>• Consider the item's age and condition</li>
                <li>• Factor in original purchase price</li>
                <li>• Leave room for negotiation</li>
                <li>• Be realistic about depreciation</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        const formValues = form.getValues()
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review Your Listing</h3>
              <p className="text-muted-foreground">Make sure everything looks good before publishing</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Title:</span>
                      <p className="text-sm text-muted-foreground">{formValues.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Category:</span>
                      <p className="text-sm text-muted-foreground">
                        {categories.find((c) => c.id === formValues.category_id)?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Condition:</span>
                      <Badge variant="secondary">{formValues.condition}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Price:</span>
                      <p className="text-lg font-bold text-primary">${formValues.price}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground line-clamp-3">{formValues.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Photos:</span>
                      <p className="text-sm text-muted-foreground">
                        {formValues.images?.length || 0} photo(s) uploaded
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">
                  Step {currentStep} of {steps.length}
                </CardTitle>
                <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
