"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getConversations } from "@/lib/api/messages"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ConversationList() {
  const { user } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchConversations() {
      if (!user?.id) return

      setIsLoading(true)
      const { data } = await getConversations(user.id)

      if (data) {
        setConversations(data)
      }

      setIsLoading(false)
    }

    fetchConversations()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start messaging other users to see your conversations here.
        </p>
        <Button className="mt-4" onClick={() => router.push("/marketplace")}>
          <Plus className="mr-2 h-4 w-4" />
          Browse Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const otherUser = conversation.otherParticipants[0]

        return (
          <Card
            key={conversation.id}
            className="hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => router.push(`/messages/${conversation.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={otherUser?.avatar_url || ""} alt={otherUser?.full_name} />
                  <AvatarFallback>{otherUser?.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{otherUser?.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{conversation.last_message}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
