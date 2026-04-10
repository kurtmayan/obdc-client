import { Field, FieldLabel } from "@/components/ui/field"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"

export default function Location() {
  return (
    <Field className="flex w-max flex-row">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Location:
      </FieldLabel>
      <Select>
        <SelectTrigger className="w-full max-w-48 text-xs font-medium text-black/50">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-regions">All Locations</SelectItem>
            <SelectItem value="ncr">Malolos Bayan</SelectItem>
            <SelectItem value="north-luzon">SM North Edsa</SelectItem>
            <SelectItem value="visayas">Ayala Cebu</SelectItem>
            <SelectItem value="region-iii">One Ayala Mall - Makati</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
