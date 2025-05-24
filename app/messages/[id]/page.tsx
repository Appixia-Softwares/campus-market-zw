import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import ConversationList from "@/components/messaging/conversation-list"
import { supabase } from "@/lib/supabase"
import { MessageThread } from "@/components/messaging/message-thread"

export const metadata: Metadata = {
  title: "Messages | ZimStudentHub",
  description: "Chat with other users about accommodations and marketplace items",
}

async function getConversationDetails(id: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      participants:conversation_participants(
        user_id,
        users(id, full_name, avatar_url)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching conversation:", error)
    return null
  }

  return data
}

export default async function MessageThreadPage({ params }: { params: { id: string } }) {
  const conversationData = await getConversationDetails(params.id)

  // Get the current user from the server component
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Find the other user in the conversation
  const otherUser = conversationData?.participants.find((p) => p.user_id !== user?.id)?.users

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="hidden md:block md:col-span-3">
          <Card className="h-[calc(100vh-12rem)] overflow-y-auto">
            <ConversationList />
          </Card>
        </div>

        <div className="md:col-span-9">
          <div className="h-[calc(100vh-12rem)]">
            <MessageThread conversationId={params.id} otherUser={otherUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
