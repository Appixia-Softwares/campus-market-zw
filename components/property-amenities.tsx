import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bath, Bed, Coffee, Dumbbell, Laptop, Lock, ShowerHead, Utensils, Wifi } from "lucide-react"

interface PropertyAmenitiesProps {
  amenities: string[]
}

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  // Map of amenity names to their icons
  const amenityIcons: Record<string, React.ReactNode> = {
    Wifi: <Wifi className="h-5 w-5" />,
    Furnished: <Bed className="h-5 w-5" />,
    "Utilities Included": <ShowerHead className="h-5 w-5" />,
    "Study Desk": <Laptop className="h-5 w-5" />,
    Kitchenette: <Utensils className="h-5 w-5" />,
    Security: <Lock className="h-5 w-5" />,
    "Laundry Room": <Bath className="h-5 w-5" />,
    Gym: <Dumbbell className="h-5 w-5" />,
    Cafe: <Coffee className="h-5 w-5" />,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {amenityIcons[amenity] || <div className="h-5 w-5 rounded-full bg-primary" />}
              </div>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
