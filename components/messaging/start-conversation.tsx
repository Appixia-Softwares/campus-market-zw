"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createConversation } from "@/lib/api/messages"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface StartConversationProps {
  recipientId: string
  recipientName: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export default function StartConversation({
  recipientId,
  recipientName,
  buttonVariant = "default",
  buttonSize = "default",
  className,
  children,
}: StartConversationProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return

    setIsLoading(true)

    const { data, error } = await createConversation(user.id, recipientId, message)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setIsOpen(false)
      router.push(`/messages/${data.conversation_id}`)
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message to {recipientName}</DialogTitle>
          <DialogDescription>
            Start a conversation with {recipientName}. They will be notified when you send your message.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder={`Write your message to ${recipientName}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
