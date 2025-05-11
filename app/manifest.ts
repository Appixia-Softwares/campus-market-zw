import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campus Market",
    short_name: "CampusMarket",
    description: "Buy, sell, and find accommodation for university students",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#09090b",
    orientation: "portrait",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-home.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    shortcuts: [
      {
        name: "Marketplace",
        url: "/marketplace",
        description: "Browse items for sale",
        icons: [{ src: "/shortcuts/marketplace.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Accommodation",
        url: "/accommodation",
        description: "Find student housing",
        icons: [{ src: "/shortcuts/accommodation.png", sizes: "96x96", type: "image/png" }],
      },
    ],
  }
}
