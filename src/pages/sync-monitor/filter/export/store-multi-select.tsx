import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
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

type StoreMultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function StoreMultiSelect({
  value,
  onChange,
  disabled = false,
}: StoreMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [storesById, setStoresById] = useState<Map<string, Store>>(
    () => new Map()
  )
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["sync-monitor-export-store-lookup", debouncedSearch],
    queryFn: async (): Promise<StoresResponse> => {
      const response = await api.get("/store/lookup", {
        params: {
          q: debouncedSearch || undefined,
        },
      })
      return response.data
    },
    enabled: !disabled,
  })

  const stores = useMemo(() => data?.items ?? [], [data?.items])


  const selectedStores = value
    .map((storeId) => storesById.get(storeId))
    .filter((store): store is Store => Boolean(store))

  const toggleStore = (store: Store) => {
    setStoresById((currentStores) => {
      const nextStores = new Map(currentStores)
      nextStores.set(store.id, store)
      return nextStores
    })

    if (value.includes(store.id)) {
      onChange(value.filter((storeId) => storeId !== store.id))
      return
    }

    onChange([...value, store.id])
  }

  const removeStore = (storeId: string) => {
    onChange(value.filter((selectedStoreId) => selectedStoreId !== storeId))
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between py-6 font-normal"
          >
            {value.length === 0 ? (
              <span className="text-muted-foreground">All stores</span>
            ) : value.length === 1 && selectedStores[0] ? (
              <span className="min-w-0 text-left">
                <span className="block truncate">{selectedStores[0].name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {selectedStores[0].location}
                </span>
              </span>
            ) : (
              <span className="text-left">{value.length} stores selected</span>
            )}

            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
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
                {isPending || isFetching ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading stores...
                  </div>
                ) : (
                  stores.map((store) => {
                    const isSelected = value.includes(store.id)

                    return (
                      <CommandItem
                        key={store.id}
                        value={`${store.name} ${store.location} ${store.id}`}
                        onSelect={() => toggleStore(store)}
                        className="flex items-start gap-2"
                      >
                        <Check
                          className={cn(
                            "mt-1 size-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium">{store.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {store.location}
                          </p>
                        </div>
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedStores.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStores.map((store) => (
            <button
              key={store.id}
              type="button"
              disabled={disabled}
              onClick={() => removeStore(store.id)}
              aria-label={`Remove ${store.name}`}
              className="flex max-w-full items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="max-w-48 truncate">{store.name}</span>
              <X className="size-3 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}