import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ShieldCheck, FileText, Users } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Help Center</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Support
            </CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              Our support team is available to help you with any issues or questions you may have.
            </p>
            <Button asChild className="w-full">
              <Link href="/messages/admin">Message Support</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              Report an Issue
            </CardTitle>
            <CardDescription>Report suspicious activity or content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              If you notice any suspicious activity or inappropriate content, please report it to us.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/report">File a Report</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                To create an account, click on the "Sign Up" button in the top right corner of the page. You'll need to
                provide your email address, create a password, and verify your student status.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I list an item for sale?</AccordionTrigger>
              <AccordionContent>
                After signing in, go to the Marketplace section and click on "Sell an Item". Fill out the form with
                details about your item, add photos, set a price, and submit your listing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do payments work?</AccordionTrigger>
              <AccordionContent>
                Campus Market facilitates in-person exchanges. We recommend meeting in a safe, public location on campus
                to complete the transaction. You can arrange payment methods directly with the buyer or seller.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I verify my student status?</AccordionTrigger>
              <AccordionContent>
                After creating your account, go to your Profile page and click on "Verify Student Status". You'll need
                to upload a photo of your student ID or provide your university email address for verification.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What if I have an issue with an order?</AccordionTrigger>
              <AccordionContent>
                If you have an issue with an order, first try to resolve it directly with the buyer or seller through
                our messaging system. If you can't resolve the issue, contact our support team for assistance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              User Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/guides/getting-started" className="text-primary hover:underline">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/help/guides/buying" className="text-primary hover:underline">
                  Buying Guide
                </Link>
              </li>
              <li>
                <Link href="/help/guides/selling" className="text-primary hover:underline">
                  Selling Guide
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              Safety & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/safety/meeting" className="text-primary hover:underline">
                  Safe Meeting Tips
                </Link>
              </li>
              <li>
                <Link href="/help/safety/payments" className="text-primary hover:underline">
                  Payment Safety
                </Link>
              </li>
              <li>
                <Link href="/help/safety/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/community/guidelines" className="text-primary hover:underline">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/help/community/feedback" className="text-primary hover:underline">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link href="/help/community/events" className="text-primary hover:underline">
                  Campus Events
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
