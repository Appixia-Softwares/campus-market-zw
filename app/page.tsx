import { getSession } from "@/lib/actions/auth"
import HeroSection from "@/components/hero-section"
import HowItWorksSection from "@/components/how-it-works-section"
import MarketplacePreviewSection from "@/components/marketplace-preview-section"
import AccommodationPreviewSection from "@/components/accommodation-preview-section"
import WhyChooseUsSection from "@/components/why-choose-us-section"
import TestimonialsSection from "@/components/testimonials-section"
import JoinNowSection from "@/components/join-now-section"
import Footer from "@/components/footer"
import { createServerClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = createServerClient()
  const session = await getSession()

  // Fetch marketplace listings directly from the database
  const { data: marketplaceListingsRaw, error: marketplaceError } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8)

  const marketplaceListings: any[] = marketplaceListingsRaw ?? []

  if (marketplaceError) {
    console.error("Error fetching marketplace listings:", marketplaceError)
  }

  // Fetch accommodation listings directly from the database
  const { data: accommodationListingsRaw, error: accommodationError } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8)

  const accommodationListings: any[] = accommodationListingsRaw ?? []

  if (accommodationError) {
    console.error("Error fetching accommodation listings:", accommodationError)
  }

  // Fetch user profiles for the listings
  if (marketplaceListings.length > 0 || accommodationListings.length > 0) {
    const userIds = [
      ...new Set([
        ...marketplaceListings.map((listing) => listing.user_id),
        ...accommodationListings.map((listing) => listing.user_id),
      ]),
    ]

    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

      if (!profilesError && profiles) {
        // Create a map of user profiles
        const profileMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile
          return acc
        }, {})

        // Add profile data to marketplace listings
        marketplaceListings.forEach((listing: any) => {
          listing.profile = profileMap[listing.user_id] || null
        })

        // Add profile data to accommodation listings
        accommodationListings.forEach((listing: any) => {
          listing.profile = profileMap[listing.user_id] || null
        })
      }
    }
  }

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <HowItWorksSection />
      <MarketplacePreviewSection listings={marketplaceListings as never} />
      <AccommodationPreviewSection listings={accommodationListings as never} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <JoinNowSection />
      <Footer />
    </main>
  )
}
