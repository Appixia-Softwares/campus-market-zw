"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"

interface VerificationActionsProps {
  userId: string
}

export default function VerificationActions({ userId }: VerificationActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const approveVerification = async () => {
    const { error } = await supabase.from("profiles").update({ is_verified: true }).eq("id", userId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve verification",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "User has been verified",
      })
      router.refresh()
    }
  }

  const rejectVerification = async () => {
    const { error } = await supabase.from("profiles").update({ verification_document: null }).eq("id", userId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject verification",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Verification has been rejected",
      })
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <Button onClick={approveVerification} className="flex-1 bg-green-600 hover:bg-green-700">
        <CheckCircle className="w-4 h-4 mr-2" />
        Approve
      </Button>
      <Button
        onClick={rejectVerification}
        variant="outline"
        className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <XCircle className="w-4 h-4 mr-2" />
        Reject
      </Button>
    </div>
  )
}
