"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid price"),
  original_price: z.string().optional(),
  category_id: z.string().min(1, "Please select a category"),
  condition: z.string().min(1, "Please select the condition"),
  brand: z.string().optional(),
  model: z.string().optional(),
  year_purchased: z.string().optional(),
  location: z.string().min(1, "Please enter the item location"),
  tags: z.string().optional(),
  specifications: z.string().optional(),
  images: z.array(z.string()).min(1, "Please upload at least one image"),
})

const conditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
]

export default function SellPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      original_price: "",
      category_id: "",
      condition: "",
      brand: "",
      model: "",
      year_purchased: "",
      location: "",
      tags: "",
      specifications: "",
      images: [],
    },
  })

  const progress = (step / 4) * 100

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
      toast({
        title: "Error",
          description: "You must be logged in to sell items",
        variant: "destructive",
      })
      return
    }

      // Parse tags from comma-separated string
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : []
      
      // Parse specifications from JSON string
      let specifications = {}
      try {
        specifications = values.specifications ? JSON.parse(values.specifications) : {}
      } catch (e) {
        console.error('Error parsing specifications:', e)
      }

      // First create the product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
        title: values.title,
        description: values.description,
          price: parseFloat(values.price),
          original_price: values.original_price ? parseFloat(values.original_price) : null,
        category_id: values.category_id,
        condition: values.condition,
        seller_id: user.id,
          status: "pending",
        brand: values.brand || null,
        model: values.model || null,
          year_purchased: values.year_purchased ? parseInt(values.year_purchased) : null,
        location: values.location,
          tags: tags,
          specifications: specifications,
        })
        .select()
        .single()

      if (productError) throw productError

      // Then create the product images records
      const imageRecords = values.images.map((url, index) => ({
        product_id: product.id,
        url: url,
        alt_text: `Product image ${index + 1}`,
        is_primary: index === 0,
        sort_order: index
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imageRecords)

      if (imagesError) throw imagesError

      toast({
        title: "Success!",
        description: "Your item has been listed successfully",
      })

      router.push("/marketplace/my-listings")
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name')
        .order('name')
      
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }
      
      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  return (
    <div className="container max-w-2xl py-8">
          <Card>
            <CardHeader>
          <CardTitle>List an Item for Sale</CardTitle>
          <CardDescription>Fill in the details about your item</CardDescription>
          <Progress value={progress} className="mt-4" />
            </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What are you selling?" {...field} />
                        </FormControl>
                        <FormDescription>
                          Be specific and descriptive
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your item in detail..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include details about condition, features, and any flaws
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                    control={form.control}
                    name="original_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          The original price when you bought it
                        </FormDescription>
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
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {conditions.map((condition) => (
                              <SelectItem key={condition} value={condition}>
                                {condition}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brand (Optional)</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., Apple, Samsung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Model (Optional)</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., iPhone 13, Galaxy S21" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_purchased"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Year Purchased (Optional)</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                          <Input placeholder="Where is the item located?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., electronics, gaming, books (comma-separated)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Add tags to help buyers find your item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"color": "black", "size": "medium", "material": "cotton"}'
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add specifications in JSON format
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onRemove={(url) => {
                              field.onChange(field.value.filter((current) => current !== url))
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload up to 5 images of your item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                          </div>
                        )}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
            </CardContent>
          </Card>
    </div>
  )
}
