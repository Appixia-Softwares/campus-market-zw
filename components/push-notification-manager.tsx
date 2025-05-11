"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission | "default">("default")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    // Set initial permission state
    setPermission(Notification.permission)

    // Show dialog if permission is not granted or denied
    if (Notification.permission === "default") {
      setIsOpen(true)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setIsOpen(false)

      if (result === "granted") {
        registerServiceWorker()
        toast({
          title: "Notifications enabled",
          description: "You will now receive notifications from Campus Market.",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Notification error",
        description: "There was a problem enabling notifications.",
        variant: "destructive",
      })
    }
  }

  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready

        // Check if push manager is available
        if (!("pushManager" in registration)) {
          console.log("Push notifications not supported by your browser")
          return
        }

        // Get VAPID public key from environment variable
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

        if (!vapidPublicKey) {
          console.error("VAPID public key not found")
          return
        }

        // Convert VAPID key to Uint8Array
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        })

        // Send subscription to server
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        })

        console.log("Push notification subscription successful")
      }
    } catch (error) {
      console.error("Error registering push notification:", error)
    }
  }

  // Function to convert base64 to Uint8Array for VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (permission !== "default" || !("Notification" in window)) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Notifications</DialogTitle>
          <DialogDescription>Stay updated with messages, order updates, and important announcements.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-muted-foreground">
              Get notified about new messages, order status changes, and other important updates from Campus Market.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="default" onClick={requestPermission}>
            <Bell className="mr-2 h-4 w-4" />
            Enable Notifications
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Not Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
