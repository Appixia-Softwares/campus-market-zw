"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function AccommodationFilters() {
  const [priceRange, setPriceRange] = useState([0, 500])

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["price", "type", "amenities"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider defaultValue={[0, 500]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Room Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="single" />
                <label
                  htmlFor="single"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Single Room
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="shared" />
                <label
                  htmlFor="shared"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Shared Room
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="studio" />
                <label
                  htmlFor="studio"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Studio Apartment
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="apartment" />
                <label
                  htmlFor="apartment"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Full Apartment
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger>Amenities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="wifi" />
                <label
                  htmlFor="wifi"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  WiFi
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="furnished" />
                <label
                  htmlFor="furnished"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Furnished
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="utilities" />
                <label
                  htmlFor="utilities"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Utilities Included
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="kitchen" />
                <label
                  htmlFor="kitchen"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Kitchen
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="laundry" />
                <label
                  htmlFor="laundry"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Laundry
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="parking" />
                <label
                  htmlFor="parking"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Parking
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="main-campus" />
                <label
                  htmlFor="main-campus"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Main Campus
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="north-campus" />
                <label
                  htmlFor="north-campus"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  North Campus
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="south-campus" />
                <label
                  htmlFor="south-campus"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  South Campus
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="city-center" />
                <label
                  htmlFor="city-center"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  City Center
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger>Verification</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified-only" />
                <label
                  htmlFor="verified-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Verified Listings Only
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-2 space-y-2">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  )
}
