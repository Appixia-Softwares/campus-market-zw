"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-8 mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Wifi className="w-10 h-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl text-center">You're offline</CardTitle>
          <CardDescription className="text-center">
            It looks like you're not connected to the internet. Some features may not be available.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4 text-muted-foreground">
            Campus Market works offline for previously visited pages and saved content. Connect to the internet to
            access all features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0 space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
