import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { RealtimeProvider } from "@/lib/realtime-context"
import { Toaster } from "@/components/ui/sonner"
import { ProtectedRoute } from "@/components/protected-route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CampusMarket Zimbabwe - Student Marketplace & Accommodation",
  description:
    "Find student accommodation, buy and sell items, and connect with fellow students across Zimbabwe's universities.",
  keywords: "student accommodation, marketplace, Zimbabwe, university, UZ, MSU, NUST, student housing",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <RealtimeProvider>
              <ProtectedRoute>
              {children}
              </ProtectedRoute>
              <Toaster />
            </RealtimeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
