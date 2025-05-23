import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Message = Database["public"]["Tables"]["messages"]["Row"]
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]

export interface MessageWithUser extends Message {
  users: {
    full_name: string
    avatar_url: string | null
  }
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      updated_at,
      last_message,
      participants:conversation_participants(
        user_id,
        users(id, full_name, avatar_url)
      )
    `)
    .contains("participants", [{ user_id: userId }])
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    return { data: null, error }
  }

  // Transform the data to make it easier to work with
  const transformedData = data.map((conversation) => {
    const otherParticipants = conversation.participants.filter((p) => p.user_id !== userId).map((p) => p.users)

    return {
      ...conversation,
      otherParticipants,
    }
  })

  return { data: transformedData, error: null }
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      users(id, full_name, avatar_url)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  return { data, error }
}

export async function sendMessage(message: MessageInsert) {
  const { data, error } = await supabase.from("messages").insert(message).select().single()

  if (!error) {
    // Update conversation's last_message and updated_at
    await supabase
      .from("conversations")
      .update({
        last_message: message.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", message.conversation_id)
  }

  return { data, error }
}

export async function createConversation(userId: string, otherUserId: string, initialMessage: string) {
  // First check if a conversation already exists between these users
  const { data: existingConversations } = await supabase
    .from("conversations")
    .select(`
      id,
      participants:conversation_participants(user_id)
    `)
    .contains("participants", [{ user_id: userId }, { user_id: otherUserId }])

  // If conversation exists, use it
  if (existingConversations && existingConversations.length > 0) {
    const conversationId = existingConversations[0].id

    // Send the message to the existing conversation
    const { data: messageData, error: messageError } = await sendMessage({
      conversation_id: conversationId,
      sender_id: userId,
      content: initialMessage,
      read: false,
    })

    return {
      data: { conversation_id: conversationId, message: messageData },
      error: messageError,
    }
  }

  // Create a new conversation
  const { data: conversationData, error: conversationError } = await supabase
    .from("conversations")
    .insert({
      last_message: initialMessage,
      created_by: userId,
    })
    .select()
    .single()

  if (conversationError) {
    return { data: null, error: conversationError }
  }

  // Add participants
  const participantsPromises = [userId, otherUserId].map((id) =>
    supabase.from("conversation_participants").insert({
      conversation_id: conversationData.id,
      user_id: id,
    }),
  )

  await Promise.all(participantsPromises)

  // Send the initial message
  const { data: messageData, error: messageError } = await sendMessage({
    conversation_id: conversationData.id,
    sender_id: userId,
    content: initialMessage,
    read: false,
  })

  return {
    data: { conversation_id: conversationData.id, message: messageData },
    error: messageError,
  }
}

export async function markConversationAsRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("read", false)

  return { error }
}

export async function getUnreadMessageCount(userId: string) {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .neq("sender_id", userId)
    .eq("read", false)

  return { count, error }
}
