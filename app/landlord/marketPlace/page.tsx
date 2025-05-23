import { MarketplaceListings } from "@/components/marketplace-listings"
import { ListingFilters } from "@/components/listing-filters"

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Browse listings from other landlords</p>
      </div>
      <ListingFilters />
      <MarketplaceListings />
    </div>
  )
}
