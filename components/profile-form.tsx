"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateUserProfile } from "@/lib/actions/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { CountrySelector } from "@/components/country-selector"
import { CitySelector } from "@/components/city-selector"
import { UniversitySelector } from "@/components/university-selector"
import { CurrencySelector } from "@/components/currency-selector"
import { LanguageSelector } from "@/components/language-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfileForm() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [avatar, setAvatar] = useState<File | null>(null)

  // New fields for international support
  const [countryId, setCountryId] = useState<string | null>(profile?.country_id || null)
  const [cityId, setCityId] = useState<string | null>(profile?.city_id || null)
  const [universityId, setUniversityId] = useState<string | null>(profile?.university_id || null)
  const [currencyId, setCurrencyId] = useState<string | null>(profile?.preferred_currency_id || null)
  const [languageId, setLanguageId] = useState<string | null>(profile?.preferred_language_id || null)
  const [timezone, setTimezone] = useState<string>(
    profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  )

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/auth/signin")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("fullName", fullName)
    formData.append("username", username)
    formData.append("phone", phone)
    if (avatar) {
      formData.append("avatar", avatar)
    }

    // Add new fields
    if (countryId) formData.append("countryId", countryId)
    if (cityId) formData.append("cityId", cityId)
    if (universityId) formData.append("universityId", universityId)
    if (currencyId) formData.append("currencyId", currencyId)
    if (languageId) formData.append("languageId", languageId)
    if (timezone) formData.append("timezone", timezone)

    const result = await updateUserProfile(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Your profile has been updated successfully",
    })

    router.refresh()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your personal information and preferences</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelector
                onSelect={(country) => {
                  setCountryId(country.id)
                  setCityId(null)
                  setUniversityId(null)
                }}
                defaultValue={profile?.country_id || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <CitySelector
                countryId={countryId}
                onSelect={(city) => {
                  setCityId(city.id)
                  setUniversityId(null)
                }}
                defaultValue={profile?.city_id || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <UniversitySelector
                countryId={countryId}
                cityId={cityId}
                onSelect={(university) => setUniversityId(university.id)}
                defaultValue={profile?.university_id || undefined}
              />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <CurrencySelector
                onSelect={(currency) => setCurrencyId(currency.id)}
                defaultValue={profile?.preferred_currency_id || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <LanguageSelector
                onSelect={(language) => setLanguageId(language.id)}
                defaultValue={profile?.preferred_language_id || undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-end space-x-2 pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
