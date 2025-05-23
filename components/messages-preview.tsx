import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

interface MessagesPreviewProps {
  userId: string
}

export async function MessagesPreview({ userId }: MessagesPreviewProps) {
  // Fetch recent messages from Supabase
  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      id,
      last_message,
      updated_at,
      participants:conversation_participants(
        user_id,
        users(id, full_name, avatar_url)
      )
    `)
    .contains("participants", [{ user_id: userId }])
    .order("updated_at", { ascending: false })
    .limit(3)

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No messages yet</p>
        <Button asChild className="mt-4">
          <Link href="/marketplace">Browse Marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        // Find the other participant
        const otherParticipant = conversation.participants.find((p) => p.user_id !== userId)?.users

        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Avatar>
              <AvatarImage src={otherParticipant?.avatar_url || ""} alt={otherParticipant?.full_name} />
              <AvatarFallback>{otherParticipant?.full_name.charAt(0).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 min-w-0">
              <p className="font-medium text-sm leading-none">{otherParticipant?.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{conversation.last_message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
              </p>
            </div>
          </Link>
        )
      })}

      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/messages">View All Messages</Link>
        </Button>
      </div>
    </div>
  )
}
