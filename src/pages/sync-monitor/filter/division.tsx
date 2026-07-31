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

export default function Division() {
  const pushParams = usePushParams()
  const [searchParams] = useSearchParams()
  const value = searchParams.get("division") ?? "all"

  return (
    <Field className="w-auto flex-none flex-row items-center gap-2">
      <FieldLabel
        htmlFor="division-filter"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Division:
      </FieldLabel>
      <Select
        value={value}
        onValueChange={(value) =>
          pushParams({
            division: value === "all" ? null : value,
            page: "1",
          })
        }
      >
        <SelectTrigger
          id="division-filter"
          className="w-44 text-xs font-medium text-black/50"
        >
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
