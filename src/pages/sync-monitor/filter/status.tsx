import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilterStore } from "@/store/useSyncMonitor"

export default function Status() {
  const { setFilter } = useFilterStore()
  return (
    <Field className="flex w-max flex-row">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Status:
      </FieldLabel>
      <Select
        onValueChange={(value) =>
          setFilter("status", value === "All" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full max-w-48 text-xs font-medium text-black/50">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Synced">Synced</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
