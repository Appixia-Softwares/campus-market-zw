"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

// Mock data for chats
const chats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Is the MacBook still available?",
    time: "10:30 AM",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "I'm interested in the room near UZ",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "Can we meet tomorrow to see the apartment?",
    time: "Yesterday",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Sarah Williams",
    lastMessage: "Thanks for the information!",
    time: "Monday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    senderId: 1,
    text: "Hi there! I saw your listing for the MacBook Pro.",
    time: "10:00 AM",
    isMe: false,
  },
  {
    id: 2,
    senderId: 0,
    text: "Hello! Yes, it's still available.",
    time: "10:05 AM",
    isMe: true,
  },
  {
    id: 3,
    senderId: 1,
    text: "Great! Is the price negotiable?",
    time: "10:10 AM",
    isMe: false,
  },
  {
    id: 4,
    senderId: 0,
    text: "I can go down to $750 if you can pick it up today.",
    time: "10:15 AM",
    isMe: true,
  },
  {
    id: 5,
    senderId: 1,
    text: "That works for me. Can I see some more pictures of it?",
    time: "10:20 AM",
    isMe: false,
  },
  {
    id: 6,
    senderId: 1,
    text: "Also, does it come with a charger?",
    time: "10:25 AM",
    isMe: false,
  },
  {
    id: 7,
    senderId: 0,
    text: "Yes, it comes with the original charger. I'll send you some more pictures right away.",
    time: "10:30 AM",
    isMe: true,
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      senderId: 0,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container h-[calc(100vh-4rem)] px-0 mx-auto md:px-4 md:py-6">
      <div className="flex h-full border rounded-none md:rounded-lg overflow-hidden">
        {/* Chat list */}
        <div className="hidden w-1/3 border-r md:block">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                  selectedChat === chat.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <Avatar>
                  <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm truncate text-muted-foreground">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selectedChat ? (
          <div className="flex flex-col w-full md:w-2/3">
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Avatar>
                <AvatarImage
                  src={chats.find((c) => c.id === selectedChat)?.avatar || "/placeholder.svg"}
                  alt={chats.find((c) => c.id === selectedChat)?.name}
                />
                <AvatarFallback>{chats.find((c) => c.id === selectedChat)?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{chats.find((c) => c.id === selectedChat)?.name}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full md:w-2/3">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
