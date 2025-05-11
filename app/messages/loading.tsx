import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
  return (
    <div className="container h-[calc(100vh-4rem)] px-0 mx-auto md:px-4 md:py-6">
      <div className="flex h-full border rounded-none md:rounded-lg overflow-hidden">
        {/* Chat list skeleton */}
        <div className="hidden w-1/3 border-r md:block">
          <div className="p-4 border-b">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area skeleton */}
        <div className="flex flex-col w-full md:w-2/3">
          {/* Chat header skeleton */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16 mt-1" />
            </div>
          </div>

          {/* Messages skeleton */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Skeleton className={`h-20 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`} />
                </div>
              ))}
            </div>
          </div>

          {/* Message input skeleton */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
