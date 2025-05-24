"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Shield, Radio } from "lucide-react"
import { healthCheck } from "@/lib/supabase"
import { env } from "@/lib/env"

interface HealthStatus {
  database: boolean
  auth: boolean
  realtime: boolean
  timestamp: string
  error?: string
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const health = await healthCheck()
      setStatus(health)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Health check failed:", error)
      setStatus({
        database: false,
        auth: false,
        realtime: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (isHealthy: boolean) => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin" />
    return isHealthy ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (isHealthy: boolean) => {
    return <Badge variant={isHealthy ? "default" : "destructive"}>{isHealthy ? "Connected" : "Disconnected"}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Real-time monitoring of database and service connections</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkHealth} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status?.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Database</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.database || false)}
              {getStatusBadge(status?.database || false)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.auth || false)}
              {getStatusBadge(status?.auth || false)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Real-time</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.realtime || false)}
              {getStatusBadge(status?.realtime || false)}
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Environment: {env.NODE_ENV}</span>
            <span>Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : "Never"}</span>
          </div>
          <div className="mt-1">
            <span>Database: {env.POSTGRES_DATABASE}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
