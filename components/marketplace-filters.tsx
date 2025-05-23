// components/marketplace-filters.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function MarketplaceFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Filters</h3>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <Slider 
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="condition">
            <AccordionTrigger>Condition</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="condition-new" />
                <Label htmlFor="condition-new">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="condition-used" />
                <Label htmlFor="condition-used">Used - Like New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="condition-good" />
                <Label htmlFor="condition-good">Used - Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="condition-fair" />
                <Label htmlFor="condition-fair">Used - Fair</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="location-north" />
                <Label htmlFor="location-north">North Campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="location-south" />
                <Label htmlFor="location-south">South Campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="location-east" />
                <Label htmlFor="location-east">East Campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="location-west" />
                <Label htmlFor="location-west">West Campus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="location-off" />
                <Label htmlFor="location-off">Off Campus</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
