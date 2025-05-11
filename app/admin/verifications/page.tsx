import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import VerificationActions from "@/components/admin/verification-actions"

export default async function AdminVerificationsPage() {
  const supabase = createServerClient()

  const { data: pendingVerifications, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_verified", false)
    .not("verification_document", "is", null)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching verifications:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Verifications</h1>
        <p className="text-muted-foreground">Review and approve student verification requests</p>
      </div>

      {pendingVerifications && pendingVerifications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingVerifications.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || "User"} />
                    <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.full_name}</CardTitle>
                    <CardDescription>{user.university || "No university"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Student ID:</div>
                    <div className="text-sm">{user.student_id || "Not provided"}</div>
                    <div className="text-sm font-medium">Submitted:</div>
                    <div className="text-sm">{formatDistanceToNow(new Date(user.updated_at), { addSuffix: true })}</div>
                  </div>
                  <div className="pt-2">
                    <Button asChild className="w-full" variant="outline">
                      <Link href={user.verification_document || "#"} target="_blank">
                        View Document
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <VerificationActions userId={user.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No pending verification requests</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
