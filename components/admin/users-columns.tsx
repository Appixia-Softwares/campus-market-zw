"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { Tables } from "@/lib/supabase/database.types"

export const columns: ColumnDef<Tables<"profiles">>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || "User"} />
            <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.username || "No username"}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "university",
    header: "University",
    cell: ({ row }) => <div>{row.original.university || "Not specified"}</div>,
  },
  {
    accessorKey: "is_verified",
    header: "Verification",
    cell: ({ row }) => {
      return row.original.is_verified ? (
        <Badge className="bg-green-500">Verified</Badge>
      ) : row.original.verification_document ? (
        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
          Pending
        </Badge>
      ) : (
        <Badge variant="outline">Not Verified</Badge>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role || "student"
      return (
        <Badge variant={role === "admin" ? "default" : "outline"}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      return (
        <div className="text-sm">{formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}</div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const { toast } = useToast()
      const router = useRouter()
      const supabase = createClient()

      const verifyUser = async () => {
        const { error } = await supabase.from("profiles").update({ is_verified: true }).eq("id", user.id)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to verify user",
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
        const { error } = await supabase.from("profiles").update({ verification_document: null }).eq("id", user.id)

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

      const makeAdmin = async () => {
        const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to make user admin",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "User is now an admin",
          })
          router.refresh()
        }
      }

      const removeAdmin = async () => {
        const { error } = await supabase.from("profiles").update({ role: "student" }).eq("id", user.id)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to remove admin role",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Admin role has been removed",
          })
          router.refresh()
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>View details</DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.verification_document && !user.is_verified && (
              <>
                <DropdownMenuItem onClick={verifyUser}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Approve verification
                </DropdownMenuItem>
                <DropdownMenuItem onClick={rejectVerification}>
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Reject verification
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {user.role === "admin" ? (
              <DropdownMenuItem onClick={removeAdmin}>Remove admin role</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={makeAdmin}>Make admin</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
