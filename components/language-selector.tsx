"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

type Language = {
  id: string
  name: string
  code: string
}

interface LanguageSelectorProps {
  onSelect: (language: Language) => void
  defaultValue?: string
  className?: string
}

export function LanguageSelector({ onSelect, defaultValue, className }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("languages").select("*").order("name")

      if (!error && data) {
        setLanguages(data)

        // Set default value if provided
        if (defaultValue) {
          const language = data.find((l) => l.id === defaultValue)
          if (language) {
            setSelectedLanguage(language)
          }
        }
      }
      setLoading(false)
    }

    fetchLanguages()
  }, [defaultValue])

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language)
    onSelect(language)
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
          {selectedLanguage
            ? `${selectedLanguage.name} (${selectedLanguage.code})`
            : loading
              ? "Loading languages..."
              : "Select language"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {languages.map((language) => (
                <CommandItem key={language.id} value={language.name} onSelect={() => handleSelect(language)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedLanguage?.id === language.id ? "opacity-100" : "opacity-0")}
                  />
                  {language.name} <span className="ml-2 text-muted-foreground">({language.code})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
