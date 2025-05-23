"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Send, ArrowLeft, ImageIcon, Paperclip, Smile } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRealtime } from "@/lib/realtime-context"
import { getMessages, sendMessage, markConversationAsRead } from "@/lib/api/messages"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
  users: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export function MessageThread() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { subscribeToMessages } = useRealtime()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = useSupabaseClient()

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!id || !user) return

      setLoading(true)
      try {
        const { data, error } = await getMessages(id)
        if (error) throw error

        setMessages(data as Message[])

        // Mark messages as read
        await markConversationAsRead(id, user.id)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [id, user, toast])

  // Subscribe to new messages
  useEffect(() => {
    if (!id || !user) return

    const unsubscribe = subscribeToMessages(id, async (payload) => {
      const newMessage = payload.new as Message

      // Fetch user details for the new message
      const { data } = await supabase
        .from("users")
        .select("id, full_name, avatar_url")
        .eq("id", newMessage.sender_id)
        .single()

      newMessage.users = data as any

      setMessages((prev) => [...prev, newMessage])

      // Mark as read if not from current user
      if (newMessage.sender_id !== user.id) {
        await markConversationAsRead(id, user.id)
      }
    })

    return unsubscribe
  }, [id, user, subscribeToMessages, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !id) return

    setSending(true)
    try {
      const { error } = await sendMessage({
        conversation_id: id,
        sender_id: user.id,
        content: messageText.trim(),
        read: false,
      })

      if (error) throw error

      setMessageText("")
      textareaRef.current?.focus()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  // Handle textarea key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-lg font-medium flex items-center">
            {loading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={messages[0]?.users?.avatar_url || ""} />
                  <AvatarFallback>{messages[0]?.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>{messages[0]?.users?.full_name || "Conversation"}</span>
              </>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                <Skeleton className="h-16 w-64 rounded-lg" />
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${message.sender_id === user?.id ? "flex-row-reverse" : ""}`}
                >
                  {message.sender_id !== user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.users?.avatar_url || ""} />
                      <AvatarFallback>{message.users?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex items-end w-full gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[60px] resize-none pr-20"
              disabled={sending}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            className="h-10 w-10 rounded-full p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
