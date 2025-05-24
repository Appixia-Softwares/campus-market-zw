import { useState } from "react"

export function useDateRange() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return { date, setDate }
} 