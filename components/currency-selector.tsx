"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"

type Currency = {
  id: string
  name: string
  code: string
  symbol: string
}

interface CurrencySelectorProps {
  onSelect: (currency: Currency) => void
  defaultValue?: string
  className?: string
}

export function CurrencySelector({ onSelect, defaultValue, className }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("currencies").select("*").order("code")

      if (!error && data) {
        setCurrencies(data)

        // Set default value if provided
        if (defaultValue) {
          const currency = data.find((c) => c.id === defaultValue)
          if (currency) {
            setSelectedCurrency(currency)
          }
        }
      }
      setLoading(false)
    }

    fetchCurrencies()
  }, [defaultValue])

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency)
    onSelect(currency)
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
          {selectedCurrency
            ? `${selectedCurrency.code} (${selectedCurrency.symbol})`
            : loading
              ? "Loading currencies..."
              : "Select currency"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.id}
                  value={`${currency.code} ${currency.name}`}
                  onSelect={() => handleSelect(currency)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedCurrency?.id === currency.id ? "opacity-100" : "opacity-0")}
                  />
                  <span className="mr-2">{currency.symbol}</span>
                  <span>{currency.code}</span>
                  <span className="ml-2 text-muted-foreground">- {currency.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
