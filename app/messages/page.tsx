import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConversationList from "@/components/messaging/conversation-list"

export const metadata: Metadata = {
  title: "Messages | ZimStudentHub",
  description: "Chat with other users about accommodations and marketplace items",
}

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Messages</CardTitle>
              <CardDescription>Chat with other users about accommodations and marketplace items</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <ConversationList />
                </TabsContent>
                <TabsContent value="unread" className="mt-4">
                  <ConversationList unreadOnly />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-9">
          <Card className="h-[calc(100vh-12rem)]">
            <CardContent className="flex items-center justify-center h-full text-center p-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
