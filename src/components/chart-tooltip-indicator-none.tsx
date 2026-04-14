import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { addDays, format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import type { DateRange } from "react-day-picker"

const chartConfig = {
  synced: {
    label: "Synced",
    color: "var(--chart-2)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },

  running: {
    label: "Synced",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Pending",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type StatisticsDatasetsType = {
  date: Date
  pending: number
  synced: number
}

export function ChartTooltipIndicatorNone() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const { data: dataStatistic = [] } = useQuery<StatisticsDatasetsType[]>({
    queryKey: ["statistics/datasets", date?.from, date?.to],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (date?.from) {
        params.set("startDate", format(date.from, "yyyy-MM-dd"))
      }
      if (date?.to) {
        params.set("endDate", format(date.to, "yyyy-MM-dd"))
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/statistics/datasets?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw data
      }
      return data
    },
  })

  const maxTotal = Math.max(
    0,
    ...(dataStatistic?.map((d) => d.synced + d.pending) ?? [])
  )

  console.log(dataStatistic)

  const dataStatistics = dataStatistic.filter((item) => {
    if (!date?.from || !date?.to) return true

    const itemDate = new Date(item.date + "T00:00:00")

    return itemDate >= date.from && itemDate <= date.to
  })

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-5 flex flex-row justify-between">
        <p className="text-[22px] font-bold">Sync Volume</p>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
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
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        {dataStatistics.length === 0 ? (
          <div className="flex h-75 items-center justify-center text-gray-400">
            No data
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={dataStatistics} barSize={58}>
              <CartesianGrid strokeDasharray="3" vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                }}
                tick={{
                  fill: "#9CA2AD",
                  fontSize: 13.42,
                  fontWeight: 400,
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <YAxis
                domain={[0, maxTotal]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={maxTotal}
                tick={{
                  fill: "#9CA2AD",
                  fontSize: 13.42,
                  fontWeight: 400,
                }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
                }
              />

              <Bar
                dataKey="pending"
                stackId="a"
                fill="#FFB266"
                radius={[0, 0, 8, 8]}
              />
              <Bar
                dataKey="synced"
                stackId="a"
                fill="#5FBE8B"
                radius={[8, 8, 0, 0]}
              />

              <ChartTooltip
                content={<ChartTooltipContent hideIndicator />}
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}
