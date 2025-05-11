import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Graduation Cap */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {/* Base of cap */}
        <rect
          x="20"
          y="45"
          width="60"
          height="10"
          rx="2"
          fill={variant === "default" ? "#1E40AF" : "#FFFFFF"}
          className="drop-shadow-sm"
        />

        {/* Top of cap */}
        <path
          d="M50 15L80 35L50 55L20 35L50 15Z"
          fill={variant === "default" ? "#2563EB" : "#FFFFFF"}
          className="drop-shadow-sm"
        />

        {/* Tassel */}
        <path
          d="M75 40V60C75 60 65 70 50 70C35 70 25 60 25 60V40"
          stroke={variant === "default" ? "#1E40AF" : "#FFFFFF"}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Shopping Bag */}
        <path
          d="M35 55H65V80C65 82.2091 63.2091 84 61 84H39C36.7909 84 35 82.2091 35 80V55Z"
          fill={variant === "default" ? "#DC2626" : "#FFFFFF"}
          className="drop-shadow-sm"
        />

        {/* Bag Handles */}
        <path
          d="M40 55V50C40 44.4772 44.4772 40 50 40C55.5228 40 60 44.4772 60 50V55"
          stroke={variant === "default" ? "#B91C1C" : "#FFFFFF"}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dollar Sign */}
        <path
          d="M50 60V75M45 65H55M45 70H55"
          stroke={variant === "default" ? "#FFFFFF" : "#DC2626"}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Circle Background for Dollar */}
        <circle
          cx="50"
          cy="67.5"
          r="10"
          fill={variant === "default" ? "#059669" : "#FFFFFF"}
          className="drop-shadow-sm"
        />

        {/* Dollar Sign */}
        <path
          d="M50 62.5V72.5M46 65H54M46 70H54"
          stroke={variant === "default" ? "#FFFFFF" : "#059669"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function LogoWithText({ className, size = "md", variant = "default" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={size} variant={variant} />
      <span
        className={cn(
          "font-bold tracking-tight",
          {
            "text-lg": size === "sm",
            "text-xl": size === "md",
            "text-2xl": size === "lg",
          },
          variant === "default" ? "text-foreground" : "text-white",
        )}
      >
        Campus Market
      </span>
    </div>
  )
}
