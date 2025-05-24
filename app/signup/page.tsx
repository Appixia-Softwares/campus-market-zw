"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Eye, EyeOff, Lock, Mail, User, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { signUp, getUniversities, signIn } from "@/lib/api/auth"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

interface University {
  id: string
  name: string
  location: string
}

type Step = {
  id: number
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself"
  },
  {
    id: 2,
    title: "University",
    description: "Select your university"
  },
  {
    id: 3,
    title: "Security",
    description: "Set up your password"
  },
  {
    id: 4,
    title: "Terms",
    description: "Review and accept terms"
  }
]

interface SignUpError {
  message: string
  code?: string
  details?: string
  hint?: string
}

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    async function loadUniversities() {
      console.log('Debug - Starting to load universities')
      setIsLoadingUniversities(true)
      try {
        const { data, error } = await getUniversities()
        console.log('Debug - Universities response:', { data, error })
        
        if (error) {
          console.error('Debug - Error loading universities:', error)
          return
        }
        
        if (data) {
          console.log('Debug - Setting universities:', data.length)
          setUniversities(data)
        } else {
          console.log('Debug - No universities data received')
        }
      } catch (err) {
        console.error('Debug - Unexpected error loading universities:', err)
      } finally {
        setIsLoadingUniversities(false)
      }
    }

    loadUniversities()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      console.log('Debug - Starting signup process')
      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        university_id: formData.university || undefined,
      })

      if (signUpError) {
        console.error('Debug - Signup error:', signUpError)
        setError(signUpError.message)
        return
      }

      console.log('Debug - Signup successful, attempting sign in')
      // Sign in the user after successful signup
      const { data: signInData, error: signInError } = await signIn(formData.email, formData.password)
      
      if (signInError) {
        console.error('Debug - Sign in error:', signInError)
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
          variant: "default",
        })
        router.push("/login?message=Please check your email to confirm your account")
        return
      }

      console.log('Debug - Sign in successful, waiting for session')
      // Wait for session to be set
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verify session is set
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('Debug - No session found after sign in')
        toast({
          title: "Account created!",
          description: "Please sign in to continue.",
          variant: "default",
        })
        router.push("/login?message=Please sign in to continue")
        return
      }

      console.log('Debug - Session verified, redirecting to dashboard')
      toast({
        title: "Account created!",
        description: "Welcome to Campus Marketplace!",
        variant: "default",
      })

      // Redirect to dashboard or the original destination
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    } catch (err: any) {
      console.error('Debug - Unexpected error:', err)
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select
                value={formData.university}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, university: value }))}
                disabled={isLoading || isLoadingUniversities}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingUniversities ? "Loading universities..." : "Select your university"} />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((university) => (
                    <SelectItem key={university.id} value={university.id}>
                      <div className="flex flex-col">
                        <span>{university.name}</span>
                        <span className="text-xs text-muted-foreground">{university.location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  terms of service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  privacy policy
                </Link>
              </label>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="container flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-xl font-bold">Campus Marketplace</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{STEPS[currentStep - 1].title}</CardTitle>
              <CardDescription className="text-center">{STEPS[currentStep - 1].description}</CardDescription>
              <Progress value={(currentStep / STEPS.length) * 100} className="mt-4" />
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSignup} className="space-y-4">
                {renderStep()}

                <div className="flex justify-between pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="ml-auto flex items-center"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative flex items-center w-full">
                <div className="flex-grow border-t border-muted"></div>
                <span className="mx-4 text-muted-foreground text-sm">or</span>
                <div className="flex-grow border-t border-muted"></div>
              </div>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                Sign up with Google
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
