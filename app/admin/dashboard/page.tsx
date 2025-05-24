import { ConnectionStatus } from "@/components/connection-status"
import { EnvironmentChecker } from "@/components/env-checker"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Overview Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-gray-600">1,234</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">New Users (Last 7 Days)</h3>
            <p className="text-gray-600">123</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">Active Users</h3>
            <p className="text-gray-600">456</p>
          </div>
        </div>
      </div>

      {/* System Status Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">System Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConnectionStatus />
          <EnvironmentChecker />
        </div>
      </div>
    </div>
  )
}
