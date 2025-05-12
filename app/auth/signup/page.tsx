"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { User, Mail, Building, Lock, ArrowRight } from "lucide-react"
import { signUp } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { AuthIllustration } from "@/components/auth/auth-illustration"
import { LogoWithText } from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CountrySelector } from "@/components/country-selector"
import { CitySelector } from "@/components/city-selector"
import { UniversitySelector } from "@/components/university-selector"
import { useToast } from "@/components/ui/use-toast"

export default function SignUpPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email) {
      setError("Please fill in all fields")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!selectedCountry) {
      setError("Please select your country")
      return false
    }
    if (!selectedCity) {
      setError("Please select your city")
      return false
    }
    if (!selectedUniversity) {
      setError("Please select your university")
      return false
    }
    if (!formData.password) {
      setError("Please enter a password")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const nextStep = () => {
    if (validateStep1()) {
      setError(null)
      setStep(2)
    }
  }

  const prevStep = () => {
    setError(null)
    setStep(1)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("countryId", selectedCountry || "")
      formData.append("cityId", selectedCity || "")
      formData.append("universityId", selectedUniversity || "")
      const result = await signUp(formData)

      if (result.error) {
        setError(result.error)
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/auth/verify-email")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthIllustration type="signup" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <LogoWithText size="md" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details to create your Campus Market account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="animate-fade-in-up">
            <div className="grid gap-4">
              {step === 1 ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@university.ac.zw"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full transition-all duration-200 hover:shadow-md mt-2"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> Country
                      </Label>
                      <CountrySelector
                        onSelect={(country) => {
                          setSelectedCountry(country.id)
                          setSelectedCity(null)
                          setSelectedUniversity(null)
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> City
                      </Label>
                      <CitySelector
                        countryId={selectedCountry}
                        onSelect={(city) => {
                          setSelectedCity(city.id)
                          setSelectedUniversity(null)
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> University
                      </Label>
                      <UniversitySelector
                        countryId={selectedCountry}
                        cityId={selectedCity}
                        onSelect={(university) => setSelectedUniversity(university.id)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="flex items-center gap-1">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                      <Lock className="h-4 w-4" /> Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 transition-all duration-200"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 transition-all duration-200 hover:shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary hover:underline hover:text-primary/90 transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
