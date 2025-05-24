import { ProductGridLoading } from "../loading"

export default function MarketplaceLoading() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Browse items from your campus community</p>
        </div>
      </div>
      <ProductGridLoading />
    </div>
  )
}
