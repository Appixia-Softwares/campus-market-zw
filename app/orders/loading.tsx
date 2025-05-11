import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function OrdersLoading() {
  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="space-y-4">
        <Skeleton className="h-10 w-full mb-6" />

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Skeleton className="w-full md:w-32 h-32" />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-40 mt-1" />
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between mt-2">
                      <div>
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
