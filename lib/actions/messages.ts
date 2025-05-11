"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getConversations() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Get all conversations where the user is either the sender or receiver
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      is_read,
      sender_id,
      receiver_id,
      profiles!messages_sender_id_fkey (id, full_name, avatar_url),
      profiles!messages_receiver_id_fkey (id, full_name, avatar_url)
    `)
    .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    return []
  }

  // Group messages by conversation (unique sender-receiver pair)
  const conversations = new Map()

  data.forEach((message) => {
    const isUserSender = message.sender_id === session.user.id
    const otherUserId = isUserSender ? message.receiver_id : message.sender_id
    const otherUser = isUserSender
      ? message.profiles.messages_receiver_id_fkey
      : message.profiles.messages_sender_id_fkey

    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, {
        id: otherUserId,
        user: otherUser,
        lastMessage: message.content,
        lastMessageTime: message.created_at,
        unreadCount: isUserSender ? 0 : message.is_read ? 0 : 1,
      })
    } else {
      // Only update unread count if the message is newer
      const existing = conversations.get(otherUserId)
      if (new Date(message.created_at) > new Date(existing.lastMessageTime)) {
        existing.lastMessage = message.content
        existing.lastMessageTime = message.created_at
        if (!isUserSender && !message.is_read) {
          existing.unreadCount += 1
        }
      } else if (!isUserSender && !message.is_read) {
        existing.unreadCount += 1
      }
    }
  })

  return Array.from(conversations.values())
}

export async function getMessages(otherUserId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Get all messages between the current user and the other user
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${session.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session.user.id})`,
    )
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  // Mark unread messages as read
  const unreadMessages = data
    .filter((message) => message.receiver_id === session.user.id && !message.is_read)
    .map((message) => message.id)

  if (unreadMessages.length > 0) {
    await supabase.from("messages").update({ is_read: true }).in("id", unreadMessages)

    revalidatePath("/messages")
  }

  return data.map((message) => ({
    ...message,
    isMe: message.sender_id === session.user.id,
  }))
}

export async function sendMessage(receiverId: string, formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to send a message" }
  }

  const content = formData.get("content") as string
  const listingId = (formData.get("listingId") as string) || null
  const listingType = (formData.get("listingType") as string) || null
  const attachment = formData.get("attachment") as File | null

  if (!content.trim() && !attachment) {
    return { error: "Message cannot be empty" }
  }

  let attachmentUrl = null

  // Handle attachment upload if present
  if (attachment) {
    const fileExt = attachment.name.split(".").pop()
    const fileName = `${session.user.id}_${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("message-attachments")
      .upload(fileName, attachment)

    if (uploadError) {
      return { error: `Error uploading attachment: ${uploadError.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("message-attachments").getPublicUrl(uploadData.path)

    attachmentUrl = publicUrl
  }

  // Create the message
  const { error } = await supabase.from("messages").insert({
    sender_id: session.user.id,
    receiver_id: receiverId,
    content: content.trim() || "Sent an attachment",
    listing_id: listingId,
    listing_type: listingType,
    attachment_url: attachmentUrl,
  })

  if (error) {
    return { error: error.message }
  }

  // Create notification for the receiver
  try {
    await supabase.from("notifications").insert({
      user_id: receiverId,
      title: "New Message",
      content: `You have a new message from ${session.user.email}`,
      link: `/messages/${session.user.id}`,
    })
  } catch (error) {
    console.error("Error creating notification:", error)
  }

  revalidatePath("/messages")
  return { success: true }
}

export async function getUnreadMessageCount() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return 0
  }

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", session.user.id)
    .eq("is_read", false)

  if (error) {
    console.error("Error fetching unread message count:", error)
    return 0
  }

  return count || 0
}
