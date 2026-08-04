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

type Employee = {
  id: string
  employeeId: string
}

type EmployeesResponse = {
  items: Employee[]
}

type EmployeeMultiSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  storeIds: string[]
  disabled?: boolean
}

export function EmployeeMultiSelect({
  value,
  onChange,
  storeIds,
  disabled = false,
}: EmployeeMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [employeesById, setEmployeesById] = useState<Map<string, Employee>>(
    () => new Map()
  )
  const debouncedSearch = useDebouncedValue(search, 300)
  const isDisabled = disabled || storeIds.length === 0

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: [
      "sync-monitor-export-employee-lookup",
      storeIds,
      debouncedSearch,
    ],
    queryFn: async (): Promise<EmployeesResponse> => {
      const response = await api.get("/sync/employee-lookup", {
        params: {
          q: debouncedSearch || undefined,
          storeIds: storeIds.join(","),
        },
      })
      return response.data
    },
    enabled: !isDisabled,
  })

  const employees = useMemo(() => data?.items ?? [], [data?.items])

  const selectedEmployees = value
    .map((employeeId) => employeesById.get(employeeId))
    .filter((employee): employee is Employee => Boolean(employee))

  const toggleEmployee = (employee: Employee) => {
    setEmployeesById((currentEmployees) => {
      const nextEmployees = new Map(currentEmployees)
      nextEmployees.set(employee.id, employee)
      return nextEmployees
    })

    if (value.includes(employee.id)) {
      onChange(value.filter((employeeId) => employeeId !== employee.id))
      return
    }

    onChange([...value, employee.id])
  }

  const removeEmployee = (employeeId: string) => {
    onChange(
      value.filter((selectedEmployeeId) => selectedEmployeeId !== employeeId)
    )
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
            disabled={isDisabled}
            className="w-full justify-between py-6 font-normal"
          >
            {storeIds.length === 0 ? (
              <span className="text-muted-foreground">Select stores first</span>
            ) : value.length === 0 ? (
              <span className="text-muted-foreground">All employees</span>
            ) : value.length === 1 && selectedEmployees[0] ? (
              <span className="min-w-0 text-left">
                <span className="block truncate">
                  {selectedEmployees[0].employeeId}
                </span>
              </span>
            ) : (
              <span className="text-left">
                {value.length} employees selected
              </span>
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
              placeholder="Search employees..."
              value={search}
              onValueChange={setSearch}
            />

            <CommandList>
              <CommandEmpty>
                {isError ? "Unable to load employees." : "No employee found."}
              </CommandEmpty>

              <CommandGroup>
                {isPending || isFetching ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading employees...
                  </div>
                ) : (
                  employees.map((employee) => {
                    const isSelected = value.includes(employee.id)

                    return (
                      <CommandItem
                        key={employee.id}
                        value={employee.employeeId}
                        onSelect={() => toggleEmployee(employee)}
                        className="flex items-center gap-2"
                      >
                        <Check
                          className={cn(
                            "size-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />

                        <p className="truncate font-medium">
                          {employee.employeeId}
                        </p>
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((employee) => (
            <button
              key={employee.id}
              type="button"
              disabled={isDisabled}
              onClick={() => removeEmployee(employee.id)}
              aria-label={`Remove ${employee.employeeId}`}
              className="flex max-w-full items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="max-w-48 truncate">{employee.employeeId}</span>
              <X className="size-3 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}