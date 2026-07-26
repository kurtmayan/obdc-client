import { useMemo, useState } from "react"
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
import { useDebouncedValue } from "@/hooks/useDebounce"

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
  selectedStore?: Store | null
}

export function StoreCombobox({
  value,
  onChange,
  onBlur,
  disabled = false,
  selectedStore,
}: StoreComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data, isPending, isError } = useQuery({
    queryKey: ["store-lookup", debouncedSearch],
    queryFn: async (): Promise<StoresResponse> => {
      const response = await api.get("/store/lookup", {
        params: {
          q: debouncedSearch || undefined,
        },
      })
      return response.data
    },
  })

  const stores = useMemo(() => data?.items ?? [], [data?.items])

  const selectedStoreFromList = stores.find((store) => store.id === value)
  const currentStore = selectedStoreFromList ?? selectedStore

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
          className="w-full justify-between py-6 font-normal"
        >
          {isPending ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading stores...
            </span>
          ) : currentStore ? (
            <span className="min-w-0 text-left">
              <span className="block truncate">{currentStore.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {currentStore.location}
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
          <CommandInput
            placeholder="Search stores..."
            value={search}
            onValueChange={setSearch}
          />

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
