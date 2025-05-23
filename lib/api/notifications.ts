import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  return { data, error }
}

export async function markNotificationAsRead(id: string) {
  const { data, error } = await supabase.from("notifications").update({ read: true }).eq("id", id).select().single()

  return { data, error }
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false)

  return { data, error }
}

export async function createNotification(notification: NotificationInsert) {
  const { data, error } = await supabase.from("notifications").insert(notification).select().single()

  return { data, error }
}

export async function deleteNotification(id: string) {
  const { data, error } = await supabase.from("notifications").delete().eq("id", id)

  return { data, error }
}

export async function getUnreadNotificationCount(userId: string) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false)

  return { count, error }
}
