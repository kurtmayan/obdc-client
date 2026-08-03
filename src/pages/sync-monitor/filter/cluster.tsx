import usePushParams from "@/hooks/usePushParams"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { useSearchParams } from "react-router"

export default function Cluster() {
  const pushParams = usePushParams()
  const [searchParams] = useSearchParams()
  const value = searchParams.get("cluster") ?? "all"

  return (
    <Field className="w-auto flex-none flex-row items-center gap-2">
      <FieldLabel
        htmlFor="cluster-filter"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Cluster:
      </FieldLabel>
      <Select
        value={value}
        onValueChange={(value) =>
          pushParams({
            cluster: value === "all" ? null : value,
            page: "1",
          })
        }
      >
        <SelectTrigger
          id="cluster-filter"
          className="w-48 text-xs font-medium text-black/50"
        >
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
            <SelectItem value="head_office">Head Office</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
