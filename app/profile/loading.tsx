import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 text-center md:text-left w-full">
                <div className="flex flex-col items-center gap-2 md:flex-row">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-40 mt-2" />
                <Skeleton className="h-4 w-32 mt-1" />
                <div className="flex flex-wrap justify-center gap-2 mt-4 md:justify-start">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
