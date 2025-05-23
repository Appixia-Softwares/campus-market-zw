import { DashboardStats } from "@/components/dashboard-stats"
import { RecentListings } from "@/components/recent-listings"
import { BookingRequests } from "@/components/booking-requests"

export default function LandlordDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight ">Dashboard</h1>
      </div>
      <div className="space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RecentListings />
          <BookingRequests />
        </div>
      </div>
    </div>
  )
}
