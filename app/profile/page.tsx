"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Upload, Phone, Mail, GraduationCap, Calendar, Edit, Save, X, Shield, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldItems: 0,
    rating: 0,
    reviewCount: 0,
  })
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    bio: "",
    university_id: "",
    year_of_study: "",
    course: "",
    location: "",
  })
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchUniversities()
    fetchUserStats()
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        university_id: profile.university_id || "",
        year_of_study: profile.year_of_study || "",
        course: profile.course || "",
        location: profile.location || "",
      })
    }
  }, [profile])

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase.from("universities").select("*").order("name")
      if (error) throw error
      setUniversities(data || [])
    } catch (err) {
      console.error("Error fetching universities:", err)
    }
  }

  const fetchUserStats = async () => {
    if (!user) return

    try {
      const { data: products, error } = await supabase.from("products").select("status").eq("seller_id", user.id)

      if (error) throw error

      const totalListings = products?.length || 0
      const activeListings = products?.filter((p) => p.status === "active").length || 0
      const soldItems = products?.filter((p) => p.status === "sold").length || 0

      setStats({
        totalListings,
        activeListings,
        soldItems,
        rating: 4.8, // Mock rating for now
        reviewCount: 12, // Mock review count for now
      })
    } catch (err) {
      console.error("Error fetching user stats:", err)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          university_id: formData.university_id || null,
          year_of_study: formData.year_of_study,
          course: formData.course,
          location: formData.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      await refreshProfile()
      setEditing(false)
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      console.error("Error updating profile:", err)
      toast.error(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatus = () => {
    if (!profile) return { verified: false, count: 0, total: 3 }

    let verifiedCount = 0
    if (profile.email_verified) verifiedCount++
    if (profile.phone_verified) verifiedCount++
    if (profile.university_id) verifiedCount++

    return {
      verified: verifiedCount === 3,
      count: verifiedCount,
      total: 3,
    }
  }

  const verificationStatus = getVerificationStatus()

  const getInitials = () => {
    const name = formData.full_name || user?.email || "User"
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{formData.full_name || "Complete your profile"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>

                <div className="flex items-center justify-center gap-2">
                  {verificationStatus.verified ? (
                    <Badge className="gap-1 bg-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Student
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {verificationStatus.count}/{verificationStatus.total} Verified
                    </Badge>
                  )}
                </div>

                {profile?.university && (
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.university.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile?.created_at || ""), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalListings}</div>
                  <div className="text-xs text-muted-foreground">Total Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.soldItems}</div>
                  <div className="text-xs text-muted-foreground">Items Sold</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">{stats.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stats.reviewCount} reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.activeListings}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      placeholder="+263..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!editing}
                    placeholder="City, Zimbabwe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    placeholder="Tell other students about yourself..."
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Select
                    value={formData.university_id}
                    onValueChange={(value) => setFormData({ ...formData, university_id: value })}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course/Program</Label>
                    <Input
                      id="course"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_of_study">Year of Study</Label>
                    <Select
                      value={formData.year_of_study}
                      onValueChange={(value) => setFormData({ ...formData, year_of_study: value })}
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="5">5th Year</SelectItem>
                        <SelectItem value="postgrad">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your email address</p>
                      </div>
                    </div>
                    {profile?.email_verified ? (
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Verify
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Phone Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your phone number</p>
                      </div>
                    </div>
                    {profile?.phone_verified ? (
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Verify
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Student Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your student status</p>
                      </div>
                    </div>
                    {profile?.university_id ? (
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
