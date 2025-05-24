import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"

export const metadata: Metadata = {
  title: "Dashboard | ZimStudentHub",
  description: "Student dashboard for accommodation and marketplace",
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
