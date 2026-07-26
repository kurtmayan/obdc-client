import { useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
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

type Store = {
  id: string
  name: string
  location: string
}

type StoresResponse = {
  items: Store[]
}

type StoreComboboxProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
}

export function StoreCombobox({
  value,
  onChange,
  onBlur,
  disabled = false,
}: StoreComboboxProps) {
  const [open, setOpen] = useState(false)

  const { data, isPending, isError } = useQuery({
    queryKey: ["stores"],
    queryFn: async (): Promise<StoresResponse> => {
      const response = await api.get("/stores")

      return response.data
    },
  })

  const stores = data?.items ?? []

  const selectedStore = stores.find((store) => store.id === value)

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          onBlur?.()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isPending}
          className="w-full justify-between font-normal"
        >
          {isPending ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading stores...
            </span>
          ) : selectedStore ? (
            <span className="min-w-0 text-left">
              <span className="block truncate">{selectedStore.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {selectedStore.location}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select a store</span>
          )}

          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search stores..." />

          <CommandList>
            <CommandEmpty>
              {isError ? "Unable to load stores." : "No store found."}
            </CommandEmpty>

            <CommandGroup>
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  value={`${store.name} ${store.location}`}
                  onSelect={() => {
                    onChange(store.id)
                    setOpen(false)
                  }}
                  className="flex items-start gap-2"
                >
                  <Check
                    className={cn(
                      "mt-1 size-4 shrink-0",
                      value === store.id ? "opacity-100" : "opacity-0"
                    )}
                  />

                  <div className="min-w-0">
                    <p className="truncate font-medium">{store.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {store.location}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
