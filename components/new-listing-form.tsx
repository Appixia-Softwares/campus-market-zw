"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getLocations, getAccommodationTypes, getAmenities } from "@/lib/api/accommodations"
import { createAccommodationAction } from "@/app/actions/accommodation"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  location_id: z.string({
    required_error: "Please select a location.",
  }),
  accommodation_type_id: z.string({
    required_error: "Please select a room type.",
  }),
  bedrooms: z.string({
    required_error: "Please select number of bedrooms.",
  }),
  bathrooms: z.string({
    required_error: "Please select number of bathrooms.",
  }),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
})

export function NewListingForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [locations, setLocations] = useState<any[]>([])
  const [accommodationTypes, setAccommodationTypes] = useState<any[]>([])
  const [amenitiesList, setAmenitiesList] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      images: [],
    },
  })

  useEffect(() => {
    async function fetchFormData() {
      const [locationsRes, typesRes, amenitiesRes] = await Promise.all([
        getLocations(),
        getAccommodationTypes(),
        getAmenities(),
      ])

      if (locationsRes.data) setLocations(locationsRes.data)
      if (typesRes.data) setAccommodationTypes(typesRes.data)
      if (amenitiesRes.data) setAmenitiesList(amenitiesRes.data)
    }

    fetchFormData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      // Create FormData object for the server action
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("price", values.price)
      formData.append("location_id", values.location_id)
      formData.append("accommodation_type_id", values.accommodation_type_id)
      formData.append("bedrooms", values.bedrooms)
      formData.append("bathrooms", values.bathrooms)
      formData.append("user_id", user.id)

      // Add amenities as JSON string
      if (values.amenities && values.amenities.length > 0) {
        formData.append("amenities", JSON.stringify(values.amenities))
      }

      // Add images
      if (values.images && values.images.length > 0) {
        for (const image of values.images) {
          formData.append("images", image)
        }
      }

      const result = await createAccommodationAction(formData)

      if (result.success) {
        toast({
          title: "Listing created",
          description: "Your accommodation listing has been created successfully",
        })
        router.push("/landlord/listings")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create listing",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cozy 2 Bedroom Apartment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (per month)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}, {location.city}
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
                name="accommodation_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accommodationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
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
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of bedrooms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of bathrooms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your property in detail..." className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6">
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                {amenitiesList.map((amenity) => (
                  <FormField
                    key={amenity.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), amenity.id])
                                  : field.onChange(field.value?.filter((value) => value !== amenity.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{amenity.name}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormDescription>Upload photos of your property (max 8)</FormDescription>
                    <FormControl>
                      <ImageUpload
                        onChange={field.onChange}
                        value={field.value}
                        multiple
                        maxFiles={8}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Listing"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
