"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

export type Report = {
  id: string
  type: string
  reporter: string
  reporter_email: string
  item_id: string
  description: string
  status: string
  date: string
}

export const ReportsColumns: ColumnDef<Report>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return <Badge variant="outline">{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
    },
  },
  {
    accessorKey: "reporter",
    header: "Reporter",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[300px] truncate" title={description}>
          {description}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge variant={status === "resolved" ? "success" : status === "dismissed" ? "destructive" : "outline"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original
      const supabase = createClient()
      const { toast } = useToast()
      const router = useRouter()

      const updateStatus = async (status: string) => {
        try {
          const { error } = await supabase.from("reports").update({ status }).eq("id", report.id)

          if (error) throw error

          toast({
            title: "Report updated",
            description: `Report has been marked as ${status}`,
          })

          router.refresh()
        } catch (error) {
          console.error("Error updating report:", error)
          toast({
            title: "Error",
            description: "Failed to update report status",
            variant: "destructive",
          })
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
            {report.item_id !== "N/A" && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/reports/${report.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {report.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => updateStatus("resolved")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus("dismissed")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Dismiss report
                </DropdownMenuItem>
              </>
            )}
            {report.status !== "pending" && (
              <DropdownMenuItem onClick={() => updateStatus("pending")}>Reopen report</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
