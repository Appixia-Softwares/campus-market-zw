"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendMessage } from "@/lib/actions/messages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Loader2, FileIcon } from "lucide-react"
import { addToSyncQueue } from "@/lib/offline-sync"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  isMe: boolean
  attachment_url?: string
}

interface RealTimeChatProps {
  receiverId: string
  initialMessages: Message[]
  receiverName: string
  receiverAvatar?: string
}

export default function RealTimeChat({ receiverId, initialMessages, receiverName, receiverAvatar }: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [lastTypingTime, setLastTypingTime] = useState(0)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { user } = useAuth()
  const { toast } = useToast()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    // Set online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Subscribe to new messages
    const messageChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${receiverId},receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const newMsg = payload.new as any
          setMessages((prev) => [
            ...prev,
            {
              ...newMsg,
              isMe: false,
            },
          ])

          // Mark as read
          supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id)

          // Play notification sound if available
          try {
            const audio = new Audio("/notification.mp3")
            audio.play().catch((e) => console.error("Error playing notification sound:", e))
          } catch (error) {
            console.error("Error with notification sound:", error)
          }
        },
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel("typing")
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.sender === receiverId && payload.payload.receiver === user.id) {
          setIsTyping(true)

          // Clear previous timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }

          // Set new timeout
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false)
          }, 3000)
        }
      })
      .subscribe()

    // Subscribe to read receipts
    const readReceiptChannel = supabase
      .channel("read_receipts")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${user.id},receiver_id=eq.${receiverId},is_read=eq.true`,
        },
        (payload) => {
          // Update read status in UI
          setMessages((prev) => prev.map((msg) => (msg.id === payload.new.id ? { ...msg, is_read: true } : msg)))
        },
      )
      .subscribe()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      supabase.removeChannel(messageChannel)
      supabase.removeChannel(typingChannel)
      supabase.removeChannel(readReceiptChannel)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [supabase, receiverId, user])

  // Handle typing indicator
  const handleTyping = () => {
    if (!user) return

    const now = new Date().getTime()

    // Only send typing indicator if it's been more than 3 seconds since last one
    if (now - lastTypingTime > 3000) {
      supabase.channel("typing").send({
        type: "broadcast",
        event: "typing",
        payload: {
          sender: user.id,
          receiver: receiverId,
        },
      })

      setLastTypingTime(now)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !user) return

    setIsLoading(true)

    // Create form data
    const formData = new FormData()
    formData.append("content", newMessage)

    // Add file if selected
    if (selectedFile) {
      formData.append("attachment", selectedFile)
    }

    // Create a temporary message for immediate display
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: receiverId,
      content: newMessage || (selectedFile ? "Sent an attachment" : ""),
      is_read: false,
      created_at: new Date().toISOString(),
      isMe: true,
    }

    // Add to UI immediately
    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")
    setSelectedFile(null)
    setFilePreview(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (!isOnline) {
      // Store for later sync if offline
      addToSyncQueue({
        type: "message",
        action: "create",
        data: {
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage,
        },
      })
      setIsLoading(false)
      return
    }

    // Send to server
    const result = await sendMessage(receiverId, formData)

    setIsLoading(false)

    if (result.error) {
      // Handle error - maybe remove the temp message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      toast({
        title: "Error sending message",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const cancelFileUpload = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-muted-foreground">Please sign in to send messages</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation by sending a message</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
              {!message.isMe && (
                <Avatar className="h-8 w-8 mr-2 self-end">
                  <AvatarImage src={receiverAvatar || "/placeholder.svg"} alt={receiverName} />
                  <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.attachment_url && (
                  <div className="mb-2">
                    <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="block">
                      {message.attachment_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img
                          src={message.attachment_url || "/placeholder.svg"}
                          alt="Attachment"
                          className="max-w-full rounded-md max-h-60 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                          <FileIcon className="h-4 w-4" />
                          <span className="text-sm truncate">Attachment</span>
                        </div>
                      )}
                    </a>
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className={`text-xs ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {message.isMe && message.is_read && <span className="text-xs text-primary-foreground/70">✓✓</span>}
                  {message.isMe && !message.is_read && <span className="text-xs text-primary-foreground/70">✓</span>}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={receiverAvatar || "/placeholder.svg"} alt={receiverName} />
                <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Connection status */}
      {!isOnline && (
        <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-center">
          <Badge variant="outline" className="bg-yellow-200 dark:bg-yellow-800">
            Offline Mode
          </Badge>
          <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
            Messages will be sent when you're back online
          </p>
        </div>
      )}

      {/* File preview */}
      {filePreview && (
        <div className="p-2 border-t">
          <div className="relative inline-block">
            <img
              src={filePreview || "/placeholder.svg"}
              alt="Upload preview"
              className="h-20 w-auto rounded-md object-cover"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={cancelFileUpload}
            >
              &times;
            </Button>
          </div>
        </div>
      )}

      {selectedFile && !filePreview && (
        <div className="p-2 border-t">
          <div className="relative inline-block">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileIcon className="h-4 w-4" />
              <span className="text-sm truncate">{selectedFile.name}</span>
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={cancelFileUpload}
            >
              &times;
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <Button type="button" size="icon" variant="ghost" onClick={handleFileUpload} className="flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder={isOnline ? "Type a message..." : "Type a message... (offline mode)"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleTyping}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || (!newMessage.trim() && !selectedFile)}
            className="flex-shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
