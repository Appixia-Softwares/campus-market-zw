import { keyframes } from "tailwindcss"

export const fadeIn = keyframes({
  "0%": { opacity: "0" },
  "100%": { opacity: "1" },
})

export const fadeInUp = keyframes({
  "0%": { opacity: "0", transform: "translateY(10px)" },
  "100%": { opacity: "1", transform: "translateY(0)" },
})

export const float = keyframes({
  "0%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-10px)" },
  "100%": { transform: "translateY(0px)" },
})