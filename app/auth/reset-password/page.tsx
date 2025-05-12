"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AuthIllustration } from "@/components/auth/auth-illustration"
import { LogoWithText } from "@/components/logo"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have a session (user is authenticated)
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        // If no session, redirect to sign in
        router.push("/auth/signin")
      }
    }

    checkSession()
  }, [router, supabase])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (success && countdown === 0) {
      router.push("/profile")
    }
    return () => clearTimeout(timer)
  }, [success, countdown, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthIllustration type="reset-password" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <LogoWithText size="md" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
            <p className="text-sm text-muted-foreground">Create a new password for your account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="space-y-4 animate-fade-in">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Password Updated</AlertTitle>
                <AlertDescription>
                  Your password has been successfully updated. You will be redirected to your profile in {countdown}{" "}
                  {countdown === 1 ? "second" : "seconds"}.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button variant="outline" asChild className="transition-all duration-200">
                  <Link href="/profile" className="flex items-center gap-2">
                    Go to Profile
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          )}

          {!success && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline hover:text-primary/90 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
