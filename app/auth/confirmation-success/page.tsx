import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ConfirmationSuccessPage() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You now have full access to Campus Market.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for verifying your email address. You can now access all features of Campus Market, including
            buying, selling, and finding accommodation.
          </p>
          <p>Complete your profile to get personalized recommendations and improve your experience.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row justify-center">
          <Button asChild>
            <Link href="/profile/complete">Complete Your Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
