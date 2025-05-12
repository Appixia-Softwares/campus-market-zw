import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { AuthProvider } from "@/components/providers/auth-provider"
import { OfflineSyncProvider } from "@/components/providers/offline-sync-provider"
import NetworkStatus from "@/components/network-status"
import PwaInstallPrompt from "@/components/pwa-install-prompt"
import PushNotificationManager from "@/components/push-notification-manager"
import PerformanceMonitor from "@/components/performance-monitor"
import { createServerClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Campus Market",
  description: "Buy, sell, and find accommodation for students",
    generator: 'v0.dev'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()

  // Use await with cookies().get()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <OfflineSyncProvider>
              <Navigation />
              <NetworkStatus />
              <PwaInstallPrompt />
              <PushNotificationManager />
              <PerformanceMonitor />
              {children}
            </OfflineSyncProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
