"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VerificationPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [studentId, setStudentId] = useState(profile?.student_id || "")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !profile?.verification_document) {
      toast({
        title: "Error",
        description: "Please upload a verification document",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let verificationDocUrl = profile?.verification_document

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("verification-documents")
          .upload(fileName, file, { upsert: true })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        const { data } = supabase.storage.from("verification-documents").getPublicUrl(fileName)
        verificationDocUrl = data.publicUrl
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          student_id: studentId,
          verification_document: verificationDocUrl,
          is_verified: false, // Reset verification status
        })
        .eq("id", user.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      toast({
        title: "Success",
        description: "Verification request submitted successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit verification",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Student Verification</CardTitle>
            <CardDescription>Verify your student status to unlock all features</CardDescription>
            {profile?.is_verified && (
              <Badge className="mt-2 bg-green-500 flex items-center w-fit gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
            {profile?.verification_document && !profile?.is_verified && (
              <Badge variant="outline" className="mt-2 text-yellow-500 border-yellow-500 flex items-center w-fit gap-1">
                <AlertCircle className="w-3 h-3" />
                Pending Review
              </Badge>
            )}
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID Number</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  disabled={profile?.is_verified}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">Verification Document</Label>
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="document"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer ${
                      profile?.is_verified ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                    }`}
                  >
                    {file || profile?.verification_document ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                        <p className="text-sm text-muted-foreground">{file ? file.name : "Document uploaded"}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm font-semibold">Click to upload</p>
                        <p className="text-xs text-muted-foreground">
                          Upload your student ID or university acceptance letter
                        </p>
                      </div>
                    )}
                    <Input
                      id="document"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      disabled={profile?.is_verified}
                    />
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF (max 5MB)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || profile?.is_verified || (profile?.verification_document && !file)}
              >
                {isSubmitting
                  ? "Submitting..."
                  : profile?.is_verified
                    ? "Already Verified"
                    : profile?.verification_document && !file
                      ? "Pending Review"
                      : "Submit for Verification"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
