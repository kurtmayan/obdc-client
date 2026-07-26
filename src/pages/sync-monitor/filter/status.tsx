import usePushParams from "@/hooks/usePushParams"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from "react-router"

export default function Status() {
  const pushParams = usePushParams()
  const [searchParams] = useSearchParams()
  const value = searchParams.get("status") ?? "all"

  return (
    <Field className="w-auto flex-none flex-row items-center gap-2">
      <FieldLabel
        htmlFor="status-filter"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Status:
      </FieldLabel>
      <Select
        value={value}
        onValueChange={(value) =>
          pushParams({
            status: value === "all" ? null : value,
            page: "1",
          })
        }
      >
        <SelectTrigger
          id="status-filter"
          className="w-36 text-xs font-medium text-black/50"
        >
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
