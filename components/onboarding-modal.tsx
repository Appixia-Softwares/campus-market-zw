"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { User, GraduationCap, Phone, FileText } from "lucide-react"
import { toast } from "sonner"

const ZIMBABWE_UNIVERSITIES = [
  { id: "1", name: "University of Zimbabwe", abbreviation: "UZ", location: "Harare" },
  { id: "2", name: "National University of Science and Technology", abbreviation: "NUST", location: "Bulawayo" },
  { id: "3", name: "Midlands State University", abbreviation: "MSU", location: "Gweru" },
  { id: "4", name: "Africa University", abbreviation: "AU", location: "Mutare" },
  { id: "5", name: "Chinhoyi University of Technology", abbreviation: "CUT", location: "Chinhoyi" },
  { id: "6", name: "Great Zimbabwe University", abbreviation: "GZU", location: "Masvingo" },
  { id: "7", name: "Harare Institute of Technology", abbreviation: "HIT", location: "Harare" },
  { id: "8", name: "Bindura University of Science Education", abbreviation: "BUSE", location: "Bindura" },
  { id: "9", name: "Zimbabwe Open University", abbreviation: "ZOU", location: "Harare" },
  { id: "10", name: "Lupane State University", abbreviation: "LSU", location: "Lupane" },
  { id: "11", name: "Manicaland State University of Applied Sciences", abbreviation: "MSUAS", location: "Mutare" },
  { id: "12", name: "Reformed Church University", abbreviation: "RCU", location: "Marondera" },
  { id: "13", name: "Solusi University", abbreviation: "SU", location: "Bulawayo" },
  { id: "14", name: "Women's University in Africa", abbreviation: "WUA", location: "Harare" },
  { id: "15", name: "Zimbabwe Ezekiel Guti University", abbreviation: "ZEGU", location: "Bindura" },
]

export function OnboardingModal() {
  const { user, profile, updateProfile } = useAuth()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form data
  const [fullName, setFullName] = useState("")
  const [universityId, setUniversityId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bio, setBio] = useState("")

  // Check if profile is incomplete
  const isProfileIncomplete = (profile: any) => {
    if (!profile) return true
    return (
      !profile.full_name ||
      profile.full_name === "User" ||
      !profile.university_id ||
      !profile.phone ||
      !profile.bio ||
      profile.status === "pending"
    )
  }

  useEffect(() => {
    if (user && profile && isProfileIncomplete(profile)) {
      setOpen(true)
      // Pre-fill existing data
      setFullName(profile.full_name || "")
      setUniversityId(profile.university_id || "")
      setBio(profile.bio || "")
      if (profile.phone) {
        // Remove +263 prefix if it exists
        const phone = profile.phone.replace("+263", "").trim()
        setPhoneNumber(phone)
      }
    }
  }, [user, profile])

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Limit to 9 digits (Zimbabwe mobile numbers)
    const limitedDigits = digits.slice(0, 9)

    // Format as XXX XXX XXX
    if (limitedDigits.length <= 3) {
      return limitedDigits
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`
    } else {
      return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Format phone number with Zimbabwe country code
      const cleanPhone = phoneNumber.replace(/\s/g, "")
      const fullPhoneNumber = `+263${cleanPhone}`

      await updateProfile({
        full_name: fullName.trim(),
        university_id: universityId,
        phone: fullPhoneNumber,
        bio: bio.trim(),
        status: "active",
      })

      toast.success("Profile completed successfully! Welcome to CampusMarket Zimbabwe!")
      setOpen(false)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast.error("Failed to complete profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return fullName.trim().length >= 2
      case 2:
        return universityId.length > 0
      case 3:
        return phoneNumber.replace(/\s/g, "").length === 9
      case 4:
        return bio.trim().length >= 10
      default:
        return false
    }
  }

  const progress = (step / 4) * 100

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🇿🇼</span>
            Complete Your Profile
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Welcome to CampusMarket Zimbabwe - connecting students across the country
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {step} of 4</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold">What's your name?</h3>
                <p className="text-sm text-muted-foreground">Help other students know who you are</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold">Which university do you attend?</h3>
                <p className="text-sm text-muted-foreground">Connect with students from your campus</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Select value={universityId} onValueChange={setUniversityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZIMBABWE_UNIVERSITIES.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        <div>
                          <div className="font-medium">{uni.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {uni.abbreviation} • {uni.location}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold">What's your phone number?</h3>
                <p className="text-sm text-muted-foreground">For account security and communication</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                    <span className="text-lg">🇿🇼</span>
                    <span className="font-medium">+263</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="77 123 4567"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="flex-1"
                    maxLength={11} // 9 digits + 2 spaces
                  />
                </div>
                <p className="text-xs text-muted-foreground">Full number: +263 {phoneNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Enter your mobile number without the country code (e.g., 77 123 4567)
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold">Tell us about yourself</h3>
                <p className="text-sm text-muted-foreground">
                  Share your interests, what you're studying, or what you're looking for
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I'm a Computer Science student at UZ, interested in technology and looking for affordable accommodation near campus..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              Previous
            </Button>
            {step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceed() || loading}>
                {loading ? "Completing..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
