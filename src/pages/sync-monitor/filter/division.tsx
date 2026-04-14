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

export default function Division() {
  const { setFilter } = useFilterStore()
  return (
    <Field className="flex w-max flex-row">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Division:
      </FieldLabel>
      <Select
        onValueChange={(value) =>
          setFilter("division", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full max-w-48 text-xs font-medium text-black/50">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="head_office">Head Office</SelectItem>
            <SelectItem value="rtm_operations">RTM Operations</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
