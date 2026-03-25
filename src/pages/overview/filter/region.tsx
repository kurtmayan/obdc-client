import { Field, FieldLabel } from "@/components/ui/field"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"

export default function Region() {
  return (
    <Field className="flex w-max flex-row">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Region:
      </FieldLabel>
      <Select>
        <SelectTrigger className="w-full max-w-48 text-xs font-medium text-black/50">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-regions">All Regions</SelectItem>
            <SelectItem value="ncr">NCR</SelectItem>
            <SelectItem value="north-luzon">North Luzon</SelectItem>
            <SelectItem value="visayas">Visayas</SelectItem>
            <SelectItem value="ncr">NCR</SelectItem>
            <SelectItem value="region-iii">Region II</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
