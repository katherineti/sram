"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl } from "./form"
import { useFormField } from "./form"

type ComboboxItem = {
    value: string;
    label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value?: string;
  onSelect: (value: string) => void;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  className?: string;
}

export function Combobox({ 
    items, 
    value,
    onSelect,
    selectPlaceholder = "Select an item",
    searchPlaceholder = "Search items...",
    noResultsMessage = "No item found.",
    className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const formField = useFormField()
  const error = formField.error

  const isInsideFormControl = 'formItemId' in formField

  const TriggerButton = (
    <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
        data-invalid={!!error}
        >
        {value
            ? items.find((item) => item.value === value)?.label
            : selectPlaceholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isInsideFormControl ? <FormControl>{TriggerButton}</FormControl> : TriggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    const selectedValue = items.find(i => i.label.toLowerCase() === currentValue.toLowerCase())?.value || "";
                    onSelect(selectedValue === value ? "" : selectedValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
