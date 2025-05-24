"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Settings } from "lucide-react"
import { validateEnv } from "@/lib/env"

interface EnvStatus {
  name: string
  value: string | undefined
  required: boolean
  category: "supabase" | "postgres" | "app"
}

export function EnvironmentChecker() {
  const [envStatus, setEnvStatus] = useState<EnvStatus[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    try {
      validateEnv()
      setValidationError(null)
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Validation failed")
    }

    const envVars: EnvStatus[] = [
      // Supabase variables
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        category: "supabase",
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        category: "supabase",
      },
      {
        name: "SUPABASE_SERVICE_ROLE_KEY",
        value: process.env.SUPABASE_SERVICE_ROLE_KEY,
        required: false,
        category: "supabase",
      },
      {
        name: "SUPABASE_JWT_SECRET",
        value: process.env.SUPABASE_JWT_SECRET,
        required: false,
        category: "supabase",
      },
      // PostgreSQL variables
      {
        name: "POSTGRES_URL",
        value: process.env.POSTGRES_URL,
        required: true,
        category: "postgres",
      },
      {
        name: "POSTGRES_PRISMA_URL",
        value: process.env.POSTGRES_PRISMA_URL,
        required: false,
        category: "postgres",
      },
      {
        name: "POSTGRES_URL_NON_POOLING",
        value: process.env.POSTGRES_URL_NON_POOLING,
        required: false,
        category: "postgres",
      },
      {
        name: "POSTGRES_USER",
        value: process.env.POSTGRES_USER,
        required: false,
        category: "postgres",
      },
      {
        name: "POSTGRES_HOST",
        value: process.env.POSTGRES_HOST,
        required: false,
        category: "postgres",
      },
      {
        name: "POSTGRES_PASSWORD",
        value: process.env.POSTGRES_PASSWORD,
        required: false,
        category: "postgres",
      },
      {
        name: "POSTGRES_DATABASE",
        value: process.env.POSTGRES_DATABASE,
        required: false,
        category: "postgres",
      },
      // App variables
      {
        name: "NEXT_PUBLIC_VERCEL_URL",
        value: process.env.NEXT_PUBLIC_VERCEL_URL,
        required: false,
        category: "app",
      },
      {
        name: "ENABLE_ANALYTICS",
        value: process.env.ENABLE_ANALYTICS,
        required: false,
        category: "app",
      },
      {
        name: "ENABLE_NOTIFICATIONS",
        value: process.env.ENABLE_NOTIFICATIONS,
        required: false,
        category: "app",
      },
    ]

    setEnvStatus(envVars)
  }, [])

  const getStatusIcon = (envVar: EnvStatus) => {
    if (envVar.required && !envVar.value) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    if (envVar.value) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusBadge = (envVar: EnvStatus) => {
    if (envVar.required && !envVar.value) {
      return <Badge variant="destructive">Missing</Badge>
    }
    if (envVar.value) {
      return <Badge variant="default">Set</Badge>
    }
    return <Badge variant="secondary">Optional</Badge>
  }

  const maskValue = (value: string | undefined) => {
    if (!value) return "Not set"
    if (value.length <= 8) return "***"
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
  }

  const groupedEnvVars = envStatus.reduce(
    (acc, envVar) => {
      if (!acc[envVar.category]) {
        acc[envVar.category] = []
      }
      acc[envVar.category].push(envVar)
      return acc
    },
    {} as Record<string, EnvStatus[]>,
  )

  const categoryTitles = {
    supabase: "Supabase Configuration",
    postgres: "PostgreSQL Configuration",
    app: "Application Configuration",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Environment Variables
        </CardTitle>
        <CardDescription>Configuration status for all environment variables</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {validationError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {Object.entries(groupedEnvVars).map(([category, vars]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
            <div className="space-y-2">
              {vars.map((envVar) => (
                <div key={envVar.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(envVar)}
                    <div>
                      <span className="font-medium">{envVar.name}</span>
                      <div className="text-sm text-muted-foreground">{maskValue(envVar.value)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {envVar.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {getStatusBadge(envVar)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-sm text-muted-foreground border-t pt-4">
          <p>
            <strong>Status Summary:</strong> {envStatus.filter((e) => e.value).length} of {envStatus.length} variables
            configured
          </p>
          <p>
            <strong>Required:</strong> {envStatus.filter((e) => e.required && e.value).length} of{" "}
            {envStatus.filter((e) => e.required).length} required variables set
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
