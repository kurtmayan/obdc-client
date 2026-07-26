import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import usePushParams from "@/hooks/usePushParams"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { useSearchParams } from "react-router"

function parseDateParam(value: string | null) {
  return value ? new Date(`${value}T00:00:00`) : undefined
}

export function DatePickerWithRange() {
  const pushParams = usePushParams()
  const [searchParams] = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  const date = React.useMemo<DateRange | undefined>(() => {
    const from = parseDateParam(startDate)
    if (!from) return undefined

    return {
      from,
      to: parseDateParam(endDate),
    }
  }, [startDate, endDate])

  const updateDate = (value: DateRange | undefined) => {
    pushParams({
      startDate: value?.from ? format(value.from, "yyyy-MM-dd") : null,
      endDate: value?.to ? format(value.to, "yyyy-MM-dd") : null,
      page: "1",
    })
  }

  const clearDate = () => {
    pushParams({ startDate: null, endDate: null, page: "1" })
  }

  return (
    <Field className="flex w-max flex-row items-center gap-3">
      <FieldLabel
        htmlFor="date-picker-range"
        className="text-xs font-medium whitespace-nowrap text-black/50"
      >
        Date Range:
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id="date-picker-range" variant="outline">
            <span className="flex-1 text-left text-xs font-medium text-black/50">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </span>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={updateDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      {date?.from && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearDate}
          aria-label="Clear date range"
        >
          <X />
        </Button>
      )}
    </Field>
  )
}
