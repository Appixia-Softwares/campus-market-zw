"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

type University = {
  id: string
  name: string
  city_id: string
  country_id: string
  website: string | null
  logo_url: string | null
}

interface UniversitySelectorProps {
  countryId: string | null
  cityId?: string | null
  onSelect: (university: University) => void
  defaultValue?: string
  className?: string
}

export function UniversitySelector({ countryId, cityId, onSelect, defaultValue, className }: UniversitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!countryId) {
        setUniversities([])
        setSelectedUniversity(null)
        return
      }

      setLoading(true)
      const supabase = createClient()
      let query = supabase.from("universities").select("*").eq("country_id", countryId)

      if (cityId) {
        query = query.eq("city_id", cityId)
      }

      const { data, error } = await query.order("name")

      if (!error && data) {
        setUniversities(data)

        // Set default value if provided
        if (defaultValue) {
          const university = data.find((u) => u.id === defaultValue)
          if (university) {
            setSelectedUniversity(university)
          } else {
            setSelectedUniversity(null)
          }
        } else {
          setSelectedUniversity(null)
        }
      }
      setLoading(false)
    }

    fetchUniversities()
  }, [countryId, cityId, defaultValue])

  const handleSelect = (university: University) => {
    setSelectedUniversity(university)
    onSelect(university)
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
          {selectedUniversity ? selectedUniversity.name : loading ? "Loading universities..." : "Select university"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search university..." />
          <CommandList>
            <CommandEmpty>No university found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {universities.map((university) => (
                <CommandItem key={university.id} value={university.name} onSelect={() => handleSelect(university)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUniversity?.id === university.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {university.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
