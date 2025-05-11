import { getMessages } from "@/lib/actions/messages"
import { getUserProfile } from "@/lib/actions/profile"
import RealTimeChat from "@/components/real-time-chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ChatPage({ params }: { params: { userId: string } }) {
  const messages = await getMessages(params.userId)
  const otherUser = await getUserProfile(params.userId)

  if (!otherUser) {
    return (
      <div className="container h-[calc(100vh-4rem)] flex items-center justify-center px-4 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-2 text-muted-foreground">The user you are trying to chat with does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/messages">Back to Messages</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container h-[calc(100vh-4rem)] px-0 mx-auto md:px-4 md:py-6">
      <div className="flex flex-col h-full border rounded-none md:rounded-lg overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href="/messages">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={otherUser.avatar_url || "/placeholder.svg"} alt={otherUser.full_name || ""} />
            <AvatarFallback>{otherUser.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUser.full_name}</h3>
            <p className="text-xs text-muted-foreground">{otherUser.university || "Student"}</p>
          </div>
        </div>

        {/* Chat area */}
        <RealTimeChat
          receiverId={params.userId}
          initialMessages={messages}
          receiverName={otherUser.full_name || "User"}
          receiverAvatar={otherUser.avatar_url || undefined}
        />
      </div>
    </div>
  )
}
