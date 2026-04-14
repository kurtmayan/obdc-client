import { Field, FieldLabel } from "@/components/ui/field"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { useFilterStore } from "@/store"

export default function Cluster() {
  const { setFilter } = useFilterStore()
  return (
    <Field className="flex w-max flex-row">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Cluster:
      </FieldLabel>
      <Select
        onValueChange={(value) =>
          setFilter("cluster", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full max-w-48 text-xs font-medium text-black/50">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="mindanao_1">Mindanao 1</SelectItem>
            <SelectItem value="mindanao_2">Mindanao 2</SelectItem>
            <SelectItem value="visayas_1">Visayas 1</SelectItem>
            <SelectItem value="visayas_2">Visayas 2</SelectItem>
            <SelectItem value="ncr_north_east">NCR North & East</SelectItem>
            <SelectItem value="ncr_south_calapa">NCR South & CALAPA</SelectItem>
            <SelectItem value="south_luzon">South Luzon</SelectItem>
            <SelectItem value="north_central_luzon">
              North & Central Luzon
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
