import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CampusEventsProps {
  universityId?: string
}

export async function CampusEvents({ universityId }: CampusEventsProps) {
  // Fetch upcoming events from Supabase
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  if (universityId) {
    query = query.eq("university_id", universityId)
  }

  const { data: events } = await query

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No upcoming events</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-4">
          <div className="rounded-md bg-primary/10 p-2 text-primary flex flex-col items-center justify-center w-14 h-14">
            <span className="text-xs font-medium">{format(new Date(event.event_date), "MMM")}</span>
            <span className="text-lg font-bold">{format(new Date(event.event_date), "d")}</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium text-sm leading-none">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.location}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(new Date(event.event_date), "h:mm a")}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    </div>
  )
}
