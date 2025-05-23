"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export function PushNotificationPrompt() {
  const { toast } = useToast()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    const supported = "Notification" in window
    setIsSupported(supported)

    if (supported) {
      // Check current permission status
      setPermission(Notification.permission)

      // Show prompt if not decided yet and hasn't been shown recently
      const hasPromptedRecently = localStorage.getItem("pushPromptShown")
      if (Notification.permission === "default" && !hasPromptedRecently) {
        // Wait a bit before showing the prompt
        const timer = setTimeout(() => {
          setShowPrompt(true)
          // Mark as shown for 7 days
          localStorage.setItem("pushPromptShown", Date.now().toString())
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleEnableNotifications = async () => {
    setIsSubscribing(true)

    try {
      // Request permission
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        // Show success toast
        toast({
          title: "Notifications enabled",
          description: "You'll now receive updates about your orders and messages.",
        })

        // In a real app, we would register the service worker and subscribe to push notifications here
      }
    } catch (error) {
      console.error("Error enabling notifications:", error)
      toast({
        title: "Notification error",
        description: "There was a problem enabling notifications.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
      setShowPrompt(false)
    }
  }

  if (!isSupported || permission === "granted" || permission === "denied") {
    return null
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stay Updated</DialogTitle>
          <DialogDescription>
            Get notified about new messages, order updates, and listings that match your interests.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Bell className="h-16 w-16 text-primary" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Not Now
          </Button>
          <Button onClick={handleEnableNotifications} disabled={isSubscribing}>
            {isSubscribing ? "Enabling..." : "Enable Notifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
