"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

type City = {
  id: string
  name: string
  country_id: string
}

interface CitySelectorProps {
  countryId: string | null
  onSelect: (city: City) => void
  defaultValue?: string
  className?: string
}

export function CitySelector({ countryId, onSelect, defaultValue, className }: CitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      if (!countryId) {
        setCities([])
        setSelectedCity(null)
        return
      }

      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("cities").select("*").eq("country_id", countryId).order("name")

      if (!error && data) {
        setCities(data)

        // Set default value if provided
        if (defaultValue) {
          const city = data.find((c) => c.id === defaultValue)
          if (city) {
            setSelectedCity(city)
          } else {
            setSelectedCity(null)
          }
        } else {
          setSelectedCity(null)
        }
      }
      setLoading(false)
    }

    fetchCities()
  }, [countryId, defaultValue])

  const handleSelect = (city: City) => {
    setSelectedCity(city)
    onSelect(city)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={loading || !countryId}
        >
          {selectedCity ? selectedCity.name : loading ? "Loading cities..." : "Select city"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {cities.map((city) => (
                <CommandItem key={city.id} value={city.name} onSelect={() => handleSelect(city)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedCity?.id === city.id ? "opacity-100" : "opacity-0")} />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
