"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { seedSampleData } from "@/lib/seed-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Users, MapPin, Home, Package } from "lucide-react"

interface DatabaseStats {
  universities: number
  locations: number
  accommodation_types: number
  product_categories: number
  users: number
}

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedingResult, setSeedingResult] = useState<string | null>(null)

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from("universities").select("*").limit(1)

      if (error) {
        console.error("Connection test failed:", error)
        setIsConnected(false)
        return
      }

      setIsConnected(true)

      // Get database statistics
      const [universitiesResult, locationsResult, typesResult, categoriesResult, usersResult] = await Promise.all([
        supabase.from("universities").select("*", { count: "exact", head: true }),
        supabase.from("locations").select("*", { count: "exact", head: true }),
        supabase.from("accommodation_types").select("*", { count: "exact", head: true }),
        supabase.from("product_categories").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
      ])

      setStats({
        universities: universitiesResult.count || 0,
        locations: locationsResult.count || 0,
        accommodation_types: typesResult.count || 0,
        product_categories: categoriesResult.count || 0,
        users: usersResult.count || 0,
      })
    } catch (error) {
      console.error("Connection check failed:", error)
      setIsConnected(false)
    }
  }

  const handleSeedData = async () => {
    setIsSeeding(true)
    setSeedingResult(null)

    try {
      const result = await seedSampleData()
      if (result.success) {
        setSeedingResult("Sample data seeded successfully!")
        await checkConnection() // Refresh stats
      } else {
        setSeedingResult(`Seeding failed: ${result.error?.message || "Unknown error"}`)
      }
    } catch (error) {
      setSeedingResult(`Seeding failed: ${error}`)
    } finally {
      setIsSeeding(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>Connection status and database statistics for Campus Market ZW</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Connection Status:</span>
          {isConnected === null ? (
            <Badge variant="secondary">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Checking...
            </Badge>
          ) : isConnected ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>

        {/* Database Statistics */}
        {stats && (
          <div className="space-y-3">
            <h4 className="font-medium">Database Statistics:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Universities</span>
                </div>
                <Badge variant="outline">{stats.universities}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Locations</span>
                </div>
                <Badge variant="outline">{stats.locations}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Accommodation Types</span>
                </div>
                <Badge variant="outline">{stats.accommodation_types}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Product Categories</span>
                </div>
                <Badge variant="outline">{stats.product_categories}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Seed Data Section */}
        {isConnected && stats && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sample Data</h4>
                <p className="text-sm text-muted-foreground">Populate the database with sample data for testing</p>
              </div>
              <Button onClick={handleSeedData} disabled={isSeeding} variant="outline" size="sm">
                {isSeeding ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  "Seed Data"
                )}
              </Button>
            </div>

            {seedingResult && (
              <div
                className={`text-sm p-2 rounded ${
                  seedingResult.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {seedingResult}
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <Button onClick={checkConnection} variant="outline" size="sm" className="w-full">
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  )
}
