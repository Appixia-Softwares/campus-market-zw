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
  title: 'Campus Market - The Next Generation Campus Marketplace',
  description: 'Campus Market is a revolutionary platform for students to buy, sell, and exchange products and services on campus. Join us for early access on May 20, 2025.',
  generator: 'Campus Market',
  authors: [{ name: 'Praise Masunga', url: 'https://github.com/Praisetechzw' }],
  metadataBase: new URL('https://campusmarket.co.zw'),
  keywords: ['campus marketplace', 'student marketplace', 'campus trading', 'student exchange', 'campus buy and sell'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://campusmarket.co.zw',
    title: 'Campus Market - The Next Generation Campus Marketplace',
    description: 'Campus Market is a revolutionary platform for students to buy, sell, and exchange products and services on campus. Join us for early access on May 20, 2025.',
    siteName: 'Campus Market',
    images: [
      {
        url: 'https://campusmarket.co.zw/logo.png',
        width: 1200,
        height: 630,
        alt: 'Campus Market Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Market - The Next Generation Campus Marketplace',
    description: 'Campus Market is a revolutionary platform for students to buy, sell, and exchange products and services on campus. Join us for early access on May 20, 2025.',
    images: ['https://campusmarket.co.zw/logo.png'],
    creator: '@campusmarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
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
