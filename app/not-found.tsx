import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-primary" />
            <CardTitle>Page Not Found</CardTitle>
          </div>
          <CardDescription>
            We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <p className="text-center text-muted-foreground">
            The page you're looking for doesn't exist or you may not have access to it.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="gap-1">
            <Link href="/">
              <Home className="h-4 w-4" /> Go back home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
