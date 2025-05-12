"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

type Country = {
  id: string
  name: string
  code: string
}

interface CountrySelectorProps {
  onSelect: (country: Country) => void
  defaultValue?: string
  className?: string
}

export function CountrySelector({ onSelect, defaultValue, className }: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("countries").select("*").order("name")

      if (!error && data) {
        setCountries(data)

        // Set default value if provided
        if (defaultValue) {
          const country = data.find((c) => c.id === defaultValue)
          if (country) {
            setSelectedCountry(country)
          }
        }
      }
      setLoading(false)
    }

    fetchCountries()
  }, [defaultValue])

  const handleSelect = (country: Country) => {
    setSelectedCountry(country)
    onSelect(country)
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
          disabled={loading}
        >
          {selectedCountry ? selectedCountry.name : loading ? "Loading countries..." : "Select country"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countries.map((country) => (
                <CommandItem key={country.id} value={country.name} onSelect={() => handleSelect(country)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedCountry?.id === country.id ? "opacity-100" : "opacity-0")}
                  />
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
