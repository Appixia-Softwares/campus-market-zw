import { cn } from "@/lib/utils"
import Image from "next/image"

interface AuthIllustrationProps {
  className?: string
  type: "signin" | "signup" | "forgot-password" | "reset-password" | "confirmation"
}

export function AuthIllustration({ className, type }: AuthIllustrationProps) {
  const illustrations = {
    signin: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    signup: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    "forgot-password": "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800",
    "reset-password": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800",
    confirmation: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  }

  return (
    <div className={cn("relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex", className)}>
      <div className="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Campus Market
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Campus Market has revolutionized how I buy and sell items on campus. It's the perfect platform for
            university students!&rdquo;
          </p>
          <footer className="text-sm">Sofia Chemhuru - UZ Student</footer>
        </blockquote>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
      <Image
        src={illustrations[type] || "/placeholder.svg"}
        alt="Authentication"
        fill
        className="absolute inset-0 object-cover"
      />
    </div>
  )
}
