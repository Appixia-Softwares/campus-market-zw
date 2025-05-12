import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, Home } from "lucide-react"
import Link from "next/link"
import { LogoWithText } from "@/components/logo"

export default function ConfirmationSuccessPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <LogoWithText size="lg" />
        </div>

        <Card className="w-full border-none shadow-lg animate-fade-in-up">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white p-3 rounded-full shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>
          <CardHeader className="text-center pt-12">
            <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
            <CardDescription className="text-base">
              Your email has been successfully verified. You now have full access to Campus Market.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-primary-foreground dark:text-primary">
              <p className="mb-2 font-medium">What's Next?</p>
              <p className="text-sm">
                Complete your profile to get personalized recommendations and improve your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center space-y-2">
                <div className="bg-background p-2 rounded-full">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium">Complete Profile</h3>
                <p className="text-xs text-muted-foreground">Add your details and preferences</p>
              </div>

              <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center space-y-2">
                <div className="bg-background p-2 rounded-full">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium">Explore Marketplace</h3>
                <p className="text-xs text-muted-foreground">Discover items and accommodations</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="w-full sm:w-auto transition-all duration-200 hover:shadow-md">
              <Link href="/profile/complete" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Complete Your Profile
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto transition-all duration-200">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" /> Go to Homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
          <p>
            Need help?{" "}
            <Link href="/help" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
