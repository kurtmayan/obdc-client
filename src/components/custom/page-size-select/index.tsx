import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import usePushParams from "@/hooks/usePushParams"
import type { PageSize } from "@/lib/pagination"

const PAGE_SIZE_OPTIONS = ["10", "50"] as const

type PageSizeSelectProps = {
  value: PageSize
}

export default function PageSizeSelect({ value }: PageSizeSelectProps) {
  const pushParams = usePushParams()
  const selectedValue = String(value)

  const handleChange = (nextPageSize: string) => {
    pushParams({ page: "1", pageSize: nextPageSize })
  }

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        className="min-w-24"
        aria-label="Rows per page"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {PAGE_SIZE_OPTIONS.map((pageSize) => (
            <SelectItem value={pageSize} key={pageSize}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
